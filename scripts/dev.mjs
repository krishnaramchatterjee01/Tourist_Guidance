import { spawn, exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('====================================================');
console.log(' Starting Explore India Full-Stack Dev Servers');
console.log(' Backend API:  http://localhost:5000');
console.log(' Frontend UI:  http://localhost:3000');
console.log('====================================================\n');

let browserOpened = false;
function openBrowserOnce() {
  if (browserOpened) return;
  browserOpened = true;
  console.log('\x1b[32m[System] Auto-launching default browser: http://localhost:3000\x1b[0m');
  if (isWindows) {
    exec('cmd /c start http://localhost:3000');
  } else if (process.platform === 'darwin') {
    exec('open http://localhost:3000');
  } else {
    exec('xdg-open http://localhost:3000');
  }
}

function runProcess(name, args, prefix, colorCode) {
  const child = spawn(npmCmd, args, {
    cwd: rootDir,
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true
  });

  const reset = '\x1b[0m';
  const color = `\x1b[${colorCode}m`;

  child.stdout.on('data', (data) => {
    const lines = data.toString().split(/\r?\n/);
    for (const line of lines) {
      if (line.trim()) {
        console.log(`${color}[${prefix}]${reset} ${line}`);
        if (prefix === 'Frontend' && (line.includes('ready in') || line.includes('Local:'))) {
          setTimeout(openBrowserOnce, 600);
        }
      }
    }
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().split(/\r?\n/);
    for (const line of lines) {
      if (line.trim()) {
        console.error(`${color}[${prefix}]${reset} ${line}`);
      }
    }
  });

  child.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.log(`${color}[${prefix}]${reset} exited with code ${code}`);
    }
  });

  return child;
}

const backendProcess = runProcess('Backend', ['run', 'dev', '--prefix', 'backend'], 'Backend', '36');
const frontendProcess = runProcess('Frontend', ['run', 'dev', '--prefix', 'frontend'], 'Frontend', '35');

function cleanup() {
  console.log('\nShutting down dev servers...');
  if (isWindows) {
    if (backendProcess.pid) {
      try { spawn('taskkill', ['/pid', backendProcess.pid.toString(), '/T', '/F']); } catch (_) {}
    }
    if (frontendProcess.pid) {
      try { spawn('taskkill', ['/pid', frontendProcess.pid.toString(), '/T', '/F']); } catch (_) {}
    }
  } else {
    backendProcess.kill('SIGTERM');
    frontendProcess.kill('SIGTERM');
  }
}

process.on('SIGINT', () => {
  cleanup();
  process.exit(0);
});

process.on('SIGTERM', () => {
  cleanup();
  process.exit(0);
});
