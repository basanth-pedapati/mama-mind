#!/usr/bin/env node

/**
 * Mama Mind Database Setup Script
 * This script helps automate the Supabase database setup process
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('\n🎉 Welcome to Mama Mind Database Setup!\n');
  
  console.log('This script will help you configure your Supabase database and environment variables.\n');
  
  // Get Supabase credentials
  console.log('📋 Please provide your Supabase project credentials:');
  console.log('(You can find these in your Supabase dashboard → Settings → API)\n');
  
  const supabaseUrl = await askQuestion('Supabase URL (https://your-project.supabase.co): ');
  const supabaseAnonKey = await askQuestion('Supabase Anon Key: ');
  const supabaseServiceKey = await askQuestion('Supabase Service Role Key (optional, for backend): ');
  
  console.log('\n⚙️  Configuring environment files...\n');
  
  // Update frontend .env.local
  const frontendEnvPath = path.join(__dirname, '..', '.env.local');
  let frontendEnvContent = '';
  
  if (fs.existsSync(frontendEnvPath)) {
    frontendEnvContent = fs.readFileSync(frontendEnvPath, 'utf8');
  }
  
  // Update or add Supabase configuration
  const envLines = frontendEnvContent.split('\n');
  const updatedEnvLines = [];
  let foundSupabaseUrl = false;
  let foundSupabaseKey = false;
  
  for (const line of envLines) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      updatedEnvLines.push(`NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}`);
      foundSupabaseUrl = true;
    } else if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      updatedEnvLines.push(`NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}`);
      foundSupabaseKey = true;
    } else if (line.trim() !== '') {
      updatedEnvLines.push(line);
    }
  }
  
  // Add missing variables
  if (!foundSupabaseUrl) {
    updatedEnvLines.push(`NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}`);
  }
  if (!foundSupabaseKey) {
    updatedEnvLines.push(`NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}`);
  }
  
  fs.writeFileSync(frontendEnvPath, updatedEnvLines.join('\n') + '\n');
  console.log('✅ Updated frontend environment variables (.env.local)');
  
  // Update backend .env
  const backendEnvPath = path.join(__dirname, '..', 'server', '.env');
  let backendEnvContent = '';
  
  if (fs.existsSync(backendEnvPath)) {
    backendEnvContent = fs.readFileSync(backendEnvPath, 'utf8');
  } else {
    // Create default backend .env
    backendEnvContent = `# Mama Mind Backend Environment Variables
NODE_ENV=development
PORT=3001
HOST=localhost

# Supabase Configuration
SUPABASE_URL=${supabaseUrl}
SUPABASE_ANON_KEY=${supabaseAnonKey}
${supabaseServiceKey ? `SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}` : '# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here'}

# OpenAI Configuration (optional)
# OPENAI_API_KEY=your_openai_api_key_here

# Redis Configuration (optional)
# REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your_jwt_secret_here_change_in_production
BCRYPT_ROUNDS=12

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
`;
    fs.writeFileSync(backendEnvPath, backendEnvContent);
    console.log('✅ Created backend environment file (server/.env)');
  }
  
  console.log('\n📊 Next steps:');
  console.log('1. Go to your Supabase dashboard → SQL Editor');
  console.log('2. Copy and paste the content from database/schema.sql');
  console.log('3. Click "Run" to create all tables and policies');
  console.log('4. Enable authentication in Authentication → Settings');
  console.log('5. Add http://localhost:3000 to Site URL and Redirect URLs');
  console.log('\n🚀 Then you can start your application:');
  console.log('   npm run dev (frontend)');
  console.log('   cd server && npm run dev (backend)');
  
  console.log('\n🎉 Setup complete! Your database is ready for Mama Mind.\n');
  
  const openDocs = await askQuestion('Would you like to open the setup documentation? (y/n): ');
  if (openDocs.toLowerCase() === 'y' || openDocs.toLowerCase() === 'yes') {
    const { exec } = require('child_process');
    const docsPath = path.join(__dirname, 'SETUP.md');
    
    // Try to open with default system editor
    if (process.platform === 'win32') {
      exec(`start ${docsPath}`);
    } else if (process.platform === 'darwin') {
      exec(`open ${docsPath}`);
    } else {
      exec(`xdg-open ${docsPath}`);
    }
  }
  
  rl.close();
}

main().catch(console.error);
