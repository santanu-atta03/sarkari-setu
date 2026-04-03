const http = require('http');

const data = JSON.stringify({
  email: 'admin@sarkarisetu.com',
  password: 'Admin@123'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('--- TEST RESULTS ---');
    console.log('Status:', res.statusCode);
    console.log('Body:', body);
  });
});

req.on('error', (error) => {
  console.error('--- ERROR ---', error.message);
});

req.write(data);
req.end();
