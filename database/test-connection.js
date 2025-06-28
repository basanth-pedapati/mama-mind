#!/usr/bin/env node

/**
 * Database Connection Test
 * This script tests the connection to Supabase and verifies the schema
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

async function testDatabaseConnection() {
  console.log('🔍 Testing Mama Mind Database Connection...\n');

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing environment variables:');
    if (!supabaseUrl) console.error('  - NEXT_PUBLIC_SUPABASE_URL');
    if (!supabaseKey) console.error('  - NEXT_PUBLIC_SUPABASE_ANON_KEY');
    console.log('\n💡 Run "npm run setup" to configure your environment');
    process.exit(1);
  }

  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('🔌 Testing connection to Supabase...');
    
    // Test basic connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      
      if (error.message.includes('relation "users" does not exist')) {
        console.log('\n💡 The database schema hasn\'t been created yet.');
        console.log('   Run the SQL schema in your Supabase dashboard:');
        console.log('   1. Go to SQL Editor in Supabase');
        console.log('   2. Copy content from database/schema.sql');
        console.log('   3. Run the query');
      }
      
      return false;
    }

    console.log('✅ Connection successful!');

    // Test each table
    const tables = [
      'users',
      'vitals', 
      'kick_counts',
      'contractions',
      'alerts',
      'chat_conversations',
      'uploaded_files',
      'appointments'
    ];

    console.log('\n📊 Checking database tables...');
    
    for (const table of tables) {
      try {
        const { error: tableError } = await supabase
          .from(table)
          .select('count')
          .limit(1);
          
        if (tableError) {
          console.log(`❌ Table "${table}": ${tableError.message}`);
        } else {
          console.log(`✅ Table "${table}": OK`);
        }
      } catch (err) {
        console.log(`❌ Table "${table}": ${err.message}`);
      }
    }

    // Test authentication
    console.log('\n🔐 Testing authentication...');
    
    try {
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        console.log(`⚠️  Auth test: ${authError.message}`);
      } else {
        console.log('✅ Authentication system: OK');
      }
    } catch (err) {
      console.log(`⚠️  Auth test: ${err.message}`);
    }

    // Test RLS policies
    console.log('\n🛡️  Testing Row Level Security...');
    
    try {
      // This should fail without authentication (which is good!)
      const { data: rlsData, error: rlsError } = await supabase
        .from('users')
        .select('*')
        .limit(1);

      if (rlsError && rlsError.message.includes('RLS')) {
        console.log('✅ Row Level Security: Properly configured');
      } else if (rlsError) {
        console.log(`⚠️  RLS test: ${rlsError.message}`);
      } else {
        console.log('⚠️  RLS might not be properly configured');
      }
    } catch (err) {
      console.log(`⚠️  RLS test: ${err.message}`);
    }

    console.log('\n🎉 Database test completed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Start the backend: cd server && npm run dev');
    console.log('   2. Start the frontend: npm run dev');
    console.log('   3. Visit http://localhost:3000');
    
    return true;

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

// Run the test
testDatabaseConnection()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
