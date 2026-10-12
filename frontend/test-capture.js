const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

async function main() {
  const chrome = spawn('google-chrome', [
    '--headless',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);
  
  await new Promise(r => setTimeout(r, 1500));

  http.get('http://127.0.0.1:9222/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('CDP endpoints:', data);
      chrome.kill();
    });
  }).on('error', (err) => {
    console.error('CDP error:', err);
    chrome.kill();
  });
}
main();
