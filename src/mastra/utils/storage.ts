/**
 * Storage Utilities
 * 
 * Pure helper functions for saving and loading research data
 */

import * as fs from 'fs';
import * as path from 'path';

export function saveResearchData(topic: string, data: any): string {
  // Create research-data directory if it doesn't exist
  const researchDir = path.join(process.cwd(), 'research-data');
  if (!fs.existsSync(researchDir)) {
    fs.mkdirSync(researchDir, { recursive: true });
  }

  // Generate filename
  const topicSlug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50);
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `research-${topicSlug}-${timestamp}.json`;
  const filepath = path.join(researchDir, filename);

  // Save file
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  console.log(`💾 Research saved: ${filename}`);

  return filename;
}

export function loadResearchData(filename: string): any {
  const filepath = path.join(process.cwd(), 'research-data', filename);
  const content = fs.readFileSync(filepath, 'utf-8');
  return JSON.parse(content);
}

