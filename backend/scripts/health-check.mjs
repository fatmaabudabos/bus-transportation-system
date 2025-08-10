import { spawn } from 'node:child_process';

const server = spawn('node', ['src/index.mjs'], { stdio: 'inherit' });

const wait = (ms) => new Promise(r => setTimeout(r, ms));

async function run() {
  try {
    await wait(800);
    const res = await fetch('http://localhost:3000/');
    const text = await res.text();

    if (res.ok && text.includes('Hello from Express backend!')) {
      console.log('Health check passed');
    } else {
      console.error('Health check failed:', res.status, text);
      process.exit(1);
    }
  } catch (err) {
    console.error('Error during health check:', err.message);
    process.exit(1);
  } finally {
    server.kill();
  }
}

run();
