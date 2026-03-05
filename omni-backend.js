#!/usr/bin/env node
/**
 * Omni-Update Backend API
 * Serves the dashboard and executes omni commands
 */

const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Execute omni command
app.post('/api/omni', async (req, res) => {
  const { concept } = req.body;

  if (!concept) {
    return res.status(400).json({ success: false, error: 'No concept provided' });
  }

  const omniPath = '/Users/nabeelsaeed/IdeaProjects/Test/omni-simple.py';
  const commitMsg = `Omni: ${concept}`;
  const command = `${omniPath} "${concept.replace(/"/g, '\\"')}" "${commitMsg}"`;

  console.log(`Executing: ${command}`);

  exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
    if (error) {
      console.error('Execution error:', error);
      return res.json({
        success: false,
        error: error.message,
        logs: stderr.split('\n')
      });
    }

    const logs = stdout.split('\n').filter(line => line.trim());

    res.json({
      success: true,
      logs,
      repos: [
        { name: 'ritehire-agent-os', status: 'success' },
        { name: 'ritehire-agentic-os', status: 'success' },
        { name: 'YES', status: 'success' },
        { name: 'psp-orch-mvp', status: 'success' },
        { name: 'psp-orch', status: 'success' },
      ]
    });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Omni-Update Backend running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard at http://localhost:5173`);
});
