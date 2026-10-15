import { spawn } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const OUT_DIR = resolve('docs/redesign/after');
mkdirSync(OUT_DIR, { recursive: true });

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Launch Chrome in headless mode with debugging port
const chrome = spawn('google-chrome', [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--remote-debugging-port=9222',
  '--window-size=1280,800',
  'about:blank'
]);

await sleep(1500);

try {
  const versionRes = await fetch('http://127.0.0.1:9222/json/version');
  const version = await versionRes.json();
  const wsUrl = version.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);

  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });

  let id = 1;
  const callbacks = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (callbacks.has(msg.id)) {
      const cb = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) cb.rej(msg.error);
      else cb.res(msg.result);
    }
  };

  function send(method, params = {}) {
    return new Promise((res, rej) => {
      const currentId = id++;
      callbacks.set(currentId, { res, rej });
      ws.send(JSON.stringify({ id: currentId, method, params }));
    });
  }

  // Create target/page
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const pageWs = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${targetId}`);

  await new Promise((res, rej) => {
    pageWs.onopen = res;
    pageWs.onerror = rej;
  });

  let pageId = 1;
  const pageCallbacks = new Map();
  pageWs.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (pageCallbacks.has(msg.id)) {
      const cb = pageCallbacks.get(msg.id);
      pageCallbacks.delete(msg.id);
      if (msg.error) cb.rej(msg.error);
      else cb.res(msg.result);
    }
  };

  function pageSend(method, params = {}) {
    return new Promise((res, rej) => {
      const currentId = pageId++;
      pageCallbacks.set(currentId, { res, rej });
      pageWs.send(JSON.stringify({ id: currentId, method, params }));
    });
  }

  await pageSend('Page.enable');
  await pageSend('Runtime.enable');

  async function capture(urlPath, theme, width, height, filename) {
    console.log(`Capturing ${filename} (${width}x${height}, theme: ${theme})...`);
    await pageSend('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 600
    });

    await pageSend('Page.navigate', { url: `http://localhost:4173${urlPath}` });
    await sleep(2000);

    // Apply theme directly and in localStorage
    await pageSend('Runtime.evaluate', {
      expression: `
        localStorage.setItem('soma-theme', '${theme}');
        document.documentElement.classList.toggle('dark', '${theme}' === 'dark');
        document.documentElement.classList.toggle('light', '${theme}' === 'light');
        document.documentElement.style.colorScheme = '${theme}';
      `
    });
    await sleep(500);

    const screenshot = await pageSend('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(screenshot.data, 'base64');
    writeFileSync(resolve(OUT_DIR, filename), buffer);
    console.log(`Saved ${filename}`);
  }

  const routes = [
    { path: '/login', name: 'login' },
    { path: '/signup', name: 'signup' },
    { path: '/reset-password', name: 'reset-password' }
  ];

  for (const route of routes) {
    for (const theme of ['dark', 'light']) {
      await capture(route.path, theme, 1280, 800, `${route.name}-${theme}-1280.png`);
      await capture(route.path, theme, 375, 667, `${route.name}-${theme}-375.png`);
    }
  }

  console.log('All screenshots captured successfully!');
  pageWs.close();
  ws.close();
} catch (err) {
  console.error('Error during capture:', err);
} finally {
  chrome.kill();
  process.exit(0);
}
