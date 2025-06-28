// Test script to debug the chat routes import issue
console.log('=== Testing different import methods ===');

// Test 1: Direct import
try {
  console.log('\n1. Testing direct import...');
  const chatDirect = await import('./routes/chat.js');
  console.log('Direct import result:', chatDirect);
  console.log('Direct import default:', chatDirect.default);
  console.log('Type:', typeof chatDirect.default);
} catch (error) {
  console.log('Direct import error:', error instanceof Error ? error.message : String(error));
}

// Test 2: Check if file exists and can be read
try {
  console.log('\n2. Testing file access...');
  const fs = await import('fs');
  const path = await import('path');
  const chatPath = path.resolve('./src/routes/chat.ts');
  console.log('Chat file path:', chatPath);
  console.log('File exists:', fs.existsSync(chatPath));
  if (fs.existsSync(chatPath)) {
    const content = fs.readFileSync(chatPath, 'utf8');
    console.log('File content length:', content.length);
    console.log('First 100 chars:', content.substring(0, 100));
  }
} catch (error) {
  console.log('File access error:', error instanceof Error ? error.message : String(error));
}

// Test 3: Try CommonJS require (if supported)
try {
  console.log('\n3. Testing CommonJS require...');
  const { createRequire } = await import('module');
  const require = createRequire(import.meta.url);
  const chatCJS = require('./routes/chat.ts');
  console.log('CommonJS import result:', chatCJS);
} catch (error) {
  console.log('CommonJS require error:', error instanceof Error ? error.message : String(error));
}
