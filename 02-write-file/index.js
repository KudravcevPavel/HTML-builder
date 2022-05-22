const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const rl = readline.createInterface({ input, output });
const text = path.join(__dirname, 'text.txt');

console.log('enter text');
fs.writeFile(text, '', (error) => {
  if (error) throw error;
});
rl.on('line', (line) => {
  if (line == 'exit') {
    console.log('goodbye');
    process.exit();
  }

  fs.appendFile(text, `${line + '\n'}`, (error) => {
    if (error) throw error;
  });
}).on('close', () => {
  console.log('goodbye');
});
