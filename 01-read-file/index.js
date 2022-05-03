const fs = require('fs');
const path = require('path');
const process = require('process');


const fileLocation = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(fileLocation, 'utf-8');
readStream.on('data', chunk => process.stdout.write(chunk));


