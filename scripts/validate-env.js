#!/usr/bin/env node

/**
 * Environment Validation Script
 * Checks if all required environment variables are set
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔍 Validating environment setup...\n');

let hasErrors = false;

// Required frontend environment variables
const frontendRequired = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

// Required backend environment variables
const backendRequired = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_SECRET'
];

// Check frontend .env.local
const frontendEnvPath = path.join(__dirname, '..', '.env.local');
console.log('📁 Checking frontend environment (.env.local)...');

if (fs.existsSync(frontendEnvPath)) {
  const frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
  
  frontendRequired.forEach(variable => {
    if (frontendEnv.includes(`${variable}=`) && !frontendEnv.includes(`${variable}=your_`)) {
      console.log(`  ✅ ${variable}`);
    } else {
      console.log(`  ❌ ${variable} - Missing or using placeholder value`);
      hasErrors = true;
    }
  });
} else {
  console.log('  ❌ .env.local file not found');
  hasErrors = true;
}

// Check backend .env
const backendEnvPath = path.join(__dirname, '..', 'server', '.env');
console.log('\n📁 Checking backend environment (server/.env)...');

if (fs.existsSync(backendEnvPath)) {
  const backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
  
  backendRequired.forEach(variable => {
    if (backendEnv.includes(`${variable}=`) && !backendEnv.includes(`${variable}=your_`)) {
      console.log(`  ✅ ${variable}`);
    } else {
      console.log(`  ❌ ${variable} - Missing or using placeholder value`);
      hasErrors = true;
    }
  });
} else {
  console.log('  ❌ server/.env file not found');
  hasErrors = true;
}

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log('❌ Environment validation failed!');
  console.log('\n📋 To fix this:');
  console.log('1. Run: npm run env:setup');
  console.log('2. Edit your .env files with real values');
  console.log('3. See ENV-SETUP.md for detailed instructions');
  process.exit(1);
} else {
  console.log('✅ Environment validation passed!');
  console.log('🚀 You\'re ready to start development');
}
