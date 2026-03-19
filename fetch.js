const https = require('https');
https.get('https://www.regraslotusgroup.com.br/vice', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log(data));
});
