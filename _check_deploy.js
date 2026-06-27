const https = require('https');

function check(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 20000 }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        resolve({ status: res.statusCode, content: data.substring(0, 500), headers: res.headers });
      });
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.on('error', reject);
  });
}

(async () => {
  try {
    console.log('Checking https://aspana-risol-express.vercel.app...');
    const result = await check('https://aspana-risol-express.vercel.app');
    console.log('Status:', result.status);
    console.log('Content-Type:', result.headers['content-type']);
    console.log('Content:', result.content);
  } catch (e) {
    console.log('Error:', e.message);
  }
})();
