#!/usr/bin/env node

// Quick Supabase connection test
// Run with: node test-supabase.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.log('Make sure you have:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

if (supabaseUrl.includes('your_supabase') || supabaseKey.includes('your_supabase')) {
  console.error('❌ Please update your .env.local with actual Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact' })
      .limit(1);
    
    if (error) {
      console.error('❌ Connection error:', error.message);
      return;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log(`📊 Users table exists and accessible`);
    
    // Test auth
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (!authError) {
      console.log('✅ Auth service accessible');
    }
    
    console.log('\n🎉 Database setup is working correctly!');
    console.log('\nNext steps:');
    console.log('1. Start your backend: cd server && npm run dev');
    console.log('2. Start your frontend: npm run dev');
    console.log('3. Open http://localhost:3000');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

testConnection();
