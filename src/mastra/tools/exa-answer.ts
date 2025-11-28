import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import OpenAI from "openai";

// Initialize Exa client using OpenAI SDK with custom baseURL
const getExaClient = () => {
  if (!process.env.EXA_API_KEY) {
    throw new Error("EXA_API_KEY environment variable is required");
  }
  
  return new OpenAI({
    baseURL: "https://api.exa.ai",
    apiKey: process.env.EXA_API_KEY,
  });
};

// Types for Exa responses
interface ExaAnswerResult {
  query: string;
  answer: string;
  sources: Array<{
    title: string;
    url: string;
    author?: string;
    publishedDate?: string;
  }>;
  error?: string;
}

/**
 * Bulk Exa Answer Tool for QSR Insight Research
 * 
 * Efficiently processes 1-50 research queries in parallel using Exa's Answer API.
 */
export const exaAnswerTool = createTool({
  id: "exa-bulk-answer",
  description: "Get answers to multiple QSR research questions efficiently. Use for gathering data about restaurant companies, financial metrics, and operational details.",
  
  inputSchema: z.object({
    queries: z
      .array(z.string())
      .min(1)
      .max(50)
      .describe("Array of research questions (1-50 queries). Each must be specific with dates."),
    
    batchOptions: z.object({
      maxRetries: z.number().default(3),
      timeoutMs: z.number().default(30000),
      maxConcurrency: z.number().default(10),
    }).optional(),
  }),

  outputSchema: z.object({
    results: z.array(z.object({
      query: z.string(),
      answer: z.string(),
      sources: z.array(z.object({
        title: z.string(),
        url: z.string(),
        author: z.string().optional(),
        publishedDate: z.string().optional(),
      })),
      error: z.string().optional(),
    })),
    summary: z.object({
      totalQueries: z.number(),
      successful: z.number(),
      failed: z.number(),
      executionTimeMs: z.number(),
    }),
  }),

  execute: async ({ context }) => {
    const { queries, batchOptions } = context;
    const { maxRetries = 3, timeoutMs = 30000, maxConcurrency = 10 } = batchOptions || {};

    const startTime = Date.now();
    console.log(`\n🔍 Starting bulk Exa research: ${queries.length} queries`);
    console.log('=' .repeat(70));
    console.log('QUERIES TO EXECUTE:');
    queries.forEach((q, i) => {
      console.log(`  ${i + 1}. "${q}"`);
    });
    console.log('=' .repeat(70));
    console.log();

    const processQuery = async (query: string): Promise<ExaAnswerResult> => {
      let lastError = "";
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

          const exaClient = getExaClient();
          const completion = await exaClient.chat.completions.create({
            model: "exa",
            messages: [{ role: "user", content: query }],
            stream: false,
          }, { signal: controller.signal });

          clearTimeout(timeoutId);

          const message = completion.choices[0]?.message;
          if (!message?.content) {
            throw new Error("No answer returned from Exa API");
          }

          const answer = message.content;
          const citations = (message as any).citations || [];
          const sources = citations.map((citation: any) => ({
            title: citation.title || "Unknown title",
            url: citation.url || "",
            author: citation.author,
            publishedDate: citation.publishedDate,
          }));

          return { query, answer, sources };

        } catch (error: any) {
          lastError = error.message || "Unknown error";
          if (attempt < maxRetries) {
            const delay = Math.pow(2, attempt - 1) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }

      return {
        query,
        answer: "",
        sources: [],
        error: `Failed after ${maxRetries} attempts: ${lastError}`,
      };
    };

    const processBatch = async (batchQueries: string[]): Promise<ExaAnswerResult[]> => {
      return Promise.all(batchQueries.map(processQuery));
    };

    const results: ExaAnswerResult[] = [];
    for (let i = 0; i < queries.length; i += maxConcurrency) {
      const batch = queries.slice(i, i + maxConcurrency);
      const batchResults = await processBatch(batch);
      results.push(...batchResults);
      
      if (i + maxConcurrency < queries.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    const successful = results.filter(r => !r.error).length;
    const failed = results.filter(r => r.error).length;
    const executionTimeMs = Date.now() - startTime;

    console.log();
    console.log('=' .repeat(70));
    console.log('QUERY RESULTS:');
    results.forEach((r, i) => {
      if (r.error) {
        console.log(`  ${i + 1}. ❌ FAILED: "${r.query}"`);
        console.log(`     Error: ${r.error}`);
      } else {
        console.log(`  ${i + 1}. ✅ "${r.query}"`);
        console.log(`     Answer: "${r.answer.substring(0, 100)}${r.answer.length > 100 ? '...' : ''}"`);
      }
    });
    console.log('=' .repeat(70));
    console.log(`\n✅ Bulk research complete: ${successful}/${queries.length} successful (${executionTimeMs}ms)\n`);

    return {
      results,
      summary: {
        totalQueries: queries.length,
        successful,
        failed,
        executionTimeMs,
      },
    };
  },
});
