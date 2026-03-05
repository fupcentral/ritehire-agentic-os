#!/usr/bin/env node
/**
 * Push daily report to Notion
 * Reads from docs/daily-reports/ and creates Notion page
 */

const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

// Notion credentials - set these as environment variables
const NOTION_API_KEY = process.env.NOTION_API_KEY || process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || process.env.NOTION_REPORTS_DB;

if (!NOTION_API_KEY) {
  console.error('❌ NOTION_API_KEY not set!');
  console.error('Set it with: export NOTION_API_KEY="secret_xxx"');
  console.error('Get it from: https://www.notion.so/my-integrations');
  process.exit(1);
}

if (!NOTION_DATABASE_ID) {
  console.error('❌ NOTION_DATABASE_ID not set!');
  console.error('Set it with: export NOTION_DATABASE_ID="xxx"');
  console.error('Find it in your Notion database URL');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_API_KEY });

async function pushReport(reportPath) {
  try {
    // Read the markdown report
    const content = fs.readFileSync(reportPath, 'utf-8');
    const fileName = path.basename(reportPath, '.md');

    // Extract title from first line
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : fileName;

    // Extract date
    const dateMatch = fileName.match(/(\d{4}-\d{2}-\d{2})/);
    const reportDate = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

    console.log(`📤 Pushing report: ${title}`);
    console.log(`📅 Date: ${reportDate}`);

    // Convert markdown sections to Notion blocks
    const blocks = markdownToNotionBlocks(content);

    // Create page in Notion
    const response = await notion.pages.create({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: title
              }
            }
          ]
        },
        Date: {
          date: {
            start: reportDate
          }
        },
        Status: {
          select: {
            name: 'Published'
          }
        }
      },
      children: blocks.slice(0, 100) // Notion limit: 100 blocks per request
    });

    console.log(`✅ Report pushed to Notion!`);
    console.log(`🔗 URL: https://notion.so/${response.id.replace(/-/g, '')}`);

    return response;
  } catch (error) {
    console.error('❌ Failed to push to Notion:', error.message);
    if (error.code === 'object_not_found') {
      console.error('Database not found. Make sure:');
      console.error('1. Your integration has access to the database');
      console.error('2. The database ID is correct');
    }
    throw error;
  }
}

function markdownToNotionBlocks(markdown) {
  const blocks = [];
  const lines = markdown.split('\n');

  let currentBlock = null;

  for (const line of lines) {
    // Headers
    if (line.startsWith('# ')) {
      blocks.push({
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [{ type: 'text', text: { content: line.substring(2) } }]
        }
      });
    } else if (line.startsWith('## ')) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: line.substring(3) } }]
        }
      });
    } else if (line.startsWith('### ')) {
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: {
          rich_text: [{ type: 'text', text: { content: line.substring(4) } }]
        }
      });
    } else if (line.startsWith('---')) {
      blocks.push({
        object: 'block',
        type: 'divider',
        divider: {}
      });
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: line.substring(2) } }]
        }
      });
    } else if (line.match(/^\d+\.\s/)) {
      blocks.push({
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [{ type: 'text', text: { content: line.replace(/^\d+\.\s/, '') } }]
        }
      });
    } else if (line.startsWith('```')) {
      // Code block - skip for now, would need multi-line handling
      continue;
    } else if (line.trim() && !line.startsWith('|')) {
      // Regular paragraph (skip table rows starting with |)
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: line } }]
        }
      });
    }
  }

  return blocks;
}

// Get report path from command line or use today's report
const reportPath = process.argv[2] ||
  path.join(__dirname, '../docs/daily-reports', `${new Date().toISOString().split('T')[0]}.md`);

if (!fs.existsSync(reportPath)) {
  console.error(`❌ Report not found: ${reportPath}`);
  process.exit(1);
}

pushReport(reportPath)
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
