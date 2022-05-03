const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output, stdout } = require('process');

const rl = readline.createInterface({ input, output });
const fileLocation = path.join(__dirname, 'text.txt');
const writeToFileStream = fs.createWriteStream(fileLocation);

rl.write('Hi, there! Type something!\n');
rl.on('line', input => input == 'exit' ? rl.close() : writeToFileStream.write(input + '\n'));
rl.on('close', () => {
  stdout.write('hmm...very interesting, thanks and bye!');
  writeToFileStream.end();
});


