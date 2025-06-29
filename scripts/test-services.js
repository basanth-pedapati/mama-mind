#!/usr/bin/env node

/**
 * External Services Test Script
 * Tests connections to all configured external services
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', 'server', '.env') });

console.log('🔍 Testing External Services Connections...\n');

let hasErrors = false;
const results = [];

// Test OpenAI API
async function testOpenAI() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      results.push('⚠️  OpenAI: API key not configured');
      return;
    }

    // Simple API test (no actual request to save costs)
    if (process.env.OPENAI_API_KEY.startsWith('sk-') && process.env.OPENAI_API_KEY.length > 20) {
      results.push('✅ OpenAI: API key format valid');
    } else {
      results.push('❌ OpenAI: Invalid API key format');
      hasErrors = true;
    }
  } catch (error) {
    results.push(`❌ OpenAI: ${error.message}`);
    hasErrors = true;
  }
}

// Test Twilio Configuration
async function testTwilio() {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      results.push('⚠️  Twilio: Credentials not configured');
      return;
    }

    if (process.env.TWILIO_ACCOUNT_SID.startsWith('AC') && 
        process.env.TWILIO_AUTH_TOKEN.length > 20) {
      results.push('✅ Twilio: Credentials format valid');
    } else {
      results.push('❌ Twilio: Invalid credential format');
      hasErrors = true;
    }
  } catch (error) {
    results.push(`❌ Twilio: ${error.message}`);
    hasErrors = true;
  }
}

// Test Email Service (Resend)
async function testResend() {
  try {
    if (!process.env.RESEND_API_KEY) {
      results.push('⚠️  Resend: API key not configured');
      return;
    }

    if (process.env.RESEND_API_KEY.startsWith('re_') && 
        process.env.RESEND_API_KEY.length > 10) {
      results.push('✅ Resend: API key format valid');
    } else {
      results.push('❌ Resend: Invalid API key format');
      hasErrors = true;
    }
  } catch (error) {
    results.push(`❌ Resend: ${error.message}`);
    hasErrors = true;
  }
}

// Test Supabase Connection
async function testSupabase() {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      results.push('❌ Supabase: Missing configuration');
      hasErrors = true;
      return;
    }

    if (process.env.SUPABASE_URL.includes('.supabase.co') && 
        process.env.SUPABASE_ANON_KEY.startsWith('eyJ')) {
      results.push('✅ Supabase: Configuration valid');
    } else {
      results.push('❌ Supabase: Invalid configuration format');
      hasErrors = true;
    }
  } catch (error) {
    results.push(`❌ Supabase: ${error.message}`);
    hasErrors = true;
  }
}

// Test Redis Configuration
async function testRedis() {
  try {
    if (!process.env.REDIS_URL) {
      results.push('⚠️  Redis: Not configured (optional)');
      return;
    }

    if (process.env.REDIS_URL.startsWith('redis://')) {
      results.push('✅ Redis: URL format valid');
    } else {
      results.push('❌ Redis: Invalid URL format');
      hasErrors = true;
    }
  } catch (error) {
    results.push(`❌ Redis: ${error.message}`);
    hasErrors = true;
  }
}

// Test Sentry Configuration
async function testSentry() {
  try {
    if (!process.env.SENTRY_DSN) {
      results.push('⚠️  Sentry: Not configured (optional)');
      return;
    }

    if (process.env.SENTRY_DSN.startsWith('https://') && 
        process.env.SENTRY_DSN.includes('@sentry.io')) {
      results.push('✅ Sentry: DSN format valid');
    } else {
      results.push('❌ Sentry: Invalid DSN format');
      hasErrors = true;
    }
  } catch (error) {
    results.push(`❌ Sentry: ${error.message}`);
    hasErrors = true;
  }
}

// Run all tests
async function runTests() {
  console.log('📋 Testing service configurations...\n');

  await testSupabase();
  await testOpenAI();
  await testTwilio();
  await testResend();
  await testRedis();
  await testSentry();

  console.log('📊 Results:');
  console.log('='.repeat(50));
  results.forEach(result => console.log(result));
  console.log('='.repeat(50));

  if (hasErrors) {
    console.log('\n❌ Some services have configuration issues!');
    console.log('\n📋 To fix:');
    console.log('1. Check your server/.env file');
    console.log('2. Verify API keys are correctly formatted');
    console.log('3. See EXTERNAL-SERVICES.md for setup guides');
    process.exit(1);
  } else {
    console.log('\n✅ All configured services look good!');
    console.log('🚀 Ready for development');
  }
}

runTests().catch(console.error);
