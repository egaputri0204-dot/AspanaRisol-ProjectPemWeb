const https = require('https');
https.get('https://aspana-risol-express.vercel.app', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Content:', data.substring(0, 1000));
    });
}).on('error', (e) => console.log('Error:', e.message));
