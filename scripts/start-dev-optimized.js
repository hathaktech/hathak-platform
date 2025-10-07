#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Set environment variables for optimization
process.env.NODE_ENV = 'development';
process.env.NODE_OPTIONS = '--max-old-space-size=2048'; // Limit Node.js memory usage

console.log('🚀 Starting Hathak Platform in optimized development mode...\n');

// Start backend with optimized settings
const backend = spawn('node', ['index.js'], {
  cwd: join(projectRoot, 'backend'),
  stdio: 'pipe',
  env: {
    ...process.env,
    NODE_ENV: 'development',
    PORT: 5000
  }
});

// Start frontend with optimized settings
const frontend = spawn('npm.cmd', ['run', 'dev:optimized'], {
  cwd: join(projectRoot, 'frontend'),
  stdio: 'pipe',
  env: {
    ...process.env,
    NODE_ENV: 'development',
    PORT: 3000
  }
});

// Handle backend output
backend.stdout.on('data', (data) => {
  console.log(`[Backend] ${data.toString().trim()}`);
});

backend.stderr.on('data', (data) => {
  console.error(`[Backend Error] ${data.toString().trim()}`);
});

// Handle frontend output
frontend.stdout.on('data', (data) => {
  console.log(`[Frontend] ${data.toString().trim()}`);
});

frontend.stderr.on('data', (data) => {
  console.error(`[Frontend Error] ${data.toString().trim()}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
});

// Handle errors
backend.on('error', (err) => {
  console.error('Backend process error:', err);
});

frontend.on('error', (err) => {
  console.error('Frontend process error:', err);
});

console.log('✅ Development servers started successfully!');
console.log('📱 Frontend: http://localhost:3000');
console.log('🔧 Backend: http://localhost:5000');
console.log('Press Ctrl+C to stop all servers\n');

