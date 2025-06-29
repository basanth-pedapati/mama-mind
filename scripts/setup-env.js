#!/usr/bin/env node

/**
 * Environment Setup Script
 * Helps developers set up their environment variables
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔧 Setting up environment files...\n');

// Frontend environment setup
const frontendEnvPath = path.join(__dirname, '.env.local');
const frontendExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(frontendEnvPath)) {
  if (fs.existsSync(frontendExamplePath)) {
    fs.copyFileSync(frontendExamplePath, frontendEnvPath);
    console.log('✅ Created .env.local from .env.example');
  } else {
    console.log('⚠️  No .env.example found for frontend');
  }
} else {
  console.log('ℹ️  Frontend .env.local already exists');
}

// Backend environment setup
const backendEnvPath = path.join(__dirname, 'server', '.env');
const backendExamplePath = path.join(__dirname, 'server', '.env.example');

if (!fs.existsSync(backendEnvPath)) {
  if (fs.existsSync(backendExamplePath)) {
    fs.copyFileSync(backendExamplePath, backendEnvPath);
    console.log('✅ Created server/.env from server/.env.example');
  } else {
    console.log('⚠️  No .env.example found for backend');
  }
} else {
  console.log('ℹ️  Backend .env already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Edit .env.local with your frontend environment variables');
console.log('2. Edit server/.env with your backend environment variables');
console.log('3. See ENV-SETUP.md for detailed instructions');
console.log('4. Run npm run env:test to validate your setup');
console.log('\n🔐 Remember: Never commit .env files to git!');
