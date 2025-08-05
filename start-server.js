#!/usr/bin/env node
// Simple Node.js starter that loads tsx and runs the server
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tsxPath = join(__dirname, 'node_modules/tsx/dist/cli.mjs');
const serverPath = join(__dirname, 'server/index.ts');

console.log('Starting GuardianChain server with tsx...');

const child = spawn('node', [tsxPath, serverPath], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

child.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});