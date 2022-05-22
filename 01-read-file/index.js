const fs = require('fs');
const path = require('path');
const text = path.join(__dirname, 'text.txt');
const myReadStream = fs.createReadStream(text, 'utf-8');
myReadStream.on('data', (chunk) => {
  console.log(chunk);
});
