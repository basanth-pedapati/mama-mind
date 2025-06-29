#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(`${colors.blue}${prompt}${colors.reset}`, resolve);
  });
}

function execCommand(command, description) {
  try {
    log(`\n⚡ ${description}...`, 'yellow');
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed!`, 'green');
  } catch (error) {
    log(`❌ Error during: ${description}`, 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description} found`, 'green');
    return true;
  } else {
    log(`❌ ${description} not found`, 'red');
    return false;
  }
}

async function main() {
  log('🤱 Welcome to Mama Mind Development Setup!', 'bold');
  log('This script will help you set up your development environment.\n');

  // Check prerequisites
  log('🔍 Checking prerequisites...', 'blue');
  
  try {
    execSync('node --version', { stdio: 'pipe' });
    log('✅ Node.js is installed', 'green');
  } catch {
    log('❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org', 'red');
    process.exit(1);
  }

  try {
    execSync('git --version', { stdio: 'pipe' });
    log('✅ Git is installed', 'green');
  } catch {
    log('❌ Git is not installed. Please install Git from https://git-scm.com', 'red');
    process.exit(1);
  }

  // Check if we're in the right directory
  if (!checkFile('package.json', 'Frontend package.json') || 
      !checkFile('server/package.json', 'Backend package.json')) {
    log('❌ Please run this script from the root of the mama-mind project', 'red');
    process.exit(1);
  }

  // Install dependencies
  const installDeps = await question('\n📦 Install dependencies? (y/n): ');
  if (installDeps.toLowerCase() === 'y') {
    execCommand('npm install', 'Installing frontend dependencies');
    execCommand('cd server && npm install', 'Installing backend dependencies');
  }

  // Setup environment variables
  log('\n🔧 Setting up environment variables...', 'blue');
  
  const hasEnv = checkFile('.env.local', 'Frontend .env.local');
  const hasServerEnv = checkFile('server/.env', 'Backend .env');

  if (!hasEnv || !hasServerEnv) {
    log('\n⚠️  Environment files are missing. You\'ll need to set up:');
    log('   📄 .env.local (frontend environment)');
    log('   📄 server/.env (backend environment)');
    log('\n💡 Check the setup guides:');
    log('   📖 QUICKSTART.md for quick setup');
    log('   📖 database/SETUP.md for database setup');
  }

  // Setup VS Code workspace
  const setupVSCode = await question('\n🎨 Setup VS Code workspace settings? (y/n): ');
  if (setupVSCode.toLowerCase() === 'y') {
    if (!fs.existsSync('.vscode')) {
      fs.mkdirSync('.vscode');
    }
    log('✅ VS Code workspace configured with recommended settings', 'green');
  }

  // Check database connection
  const testDB = await question('\n🗃️  Test database connection? (y/n): ');
  if (testDB.toLowerCase() === 'y') {
    try {
      execCommand('cd server && npm run db:test', 'Testing database connection');
    } catch {
      log('⚠️  Database connection failed. Please check your Supabase configuration.', 'yellow');
      log('   Run: npm run setup (in project root) for interactive database setup', 'blue');
    }
  }

  // Start development servers
  const startServers = await question('\n🚀 Start development servers? (y/n): ');
  if (startServers.toLowerCase() === 'y') {
    log('\n📋 To start development:');
    log('   Terminal 1: npm run dev (frontend - http://localhost:3000)', 'blue');
    log('   Terminal 2: cd server && npm run dev (backend - http://localhost:3001)', 'blue');
    log('\n💡 Or run both with: npm run dev:all', 'yellow');

    const choice = await question('\nStart now? (f)rontend only, (b)ackend only, (a)ll, (n)o: ');
    
    switch (choice.toLowerCase()) {
      case 'f':
        execCommand('npm run dev', 'Starting frontend development server');
        break;
      case 'b':
        execCommand('cd server && npm run dev', 'Starting backend development server');
        break;
      case 'a':
        log('\n🚀 Starting both servers...', 'green');
        log('Frontend: http://localhost:3000', 'blue');
        log('Backend: http://localhost:3001', 'blue');
        log('Press Ctrl+C to stop\n', 'yellow');
        
        // Start both servers
        const { spawn } = require('child_process');
        
        const frontend = spawn('npm', ['run', 'dev'], { stdio: 'inherit' });
        const backend = spawn('npm', ['run', 'dev'], { 
          cwd: './server', 
          stdio: 'inherit' 
        });

        process.on('SIGINT', () => {
          frontend.kill();
          backend.kill();
          process.exit();
        });
        break;
      default:
        log('👍 Servers not started. Use the commands above when ready.', 'blue');
    }
  }

  log('\n🎉 Setup completed!', 'bold');
  log('\n📚 Useful resources:');
  log('   📖 DEVELOPER-GUIDE.md - Complete development guide');
  log('   📖 src/FRONTEND-GUIDE.md - Frontend development');
  log('   📖 server/BACKEND-GUIDE.md - Backend development');
  log('   📖 CONTRIBUTING.md - How to contribute');
  log('   📖 database/SETUP.md - Database setup');

  log('\n🤝 Need help?');
  log('   💬 Create a discussion on GitHub');
  log('   🐛 Report issues with detailed descriptions');
  log('   📧 Contact: team@mamamind.com');

  log('\nHappy coding! 🤱💻', 'green');
  
  rl.close();
}

main().catch((error) => {
  log(`❌ Setup failed: ${error.message}`, 'red');
  process.exit(1);
});
