const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'files');
const outputDir = path.join(__dirname, 'files-copy');

fs.mkdir(outputDir, { recursive: true }, errorHandler); 

fs.readdir(inputDir, (err, files) => { 
  if (err) throw err;
  else files.forEach(el => {
    fs.copyFile(path.join(inputDir, el), path.join(outputDir, el), errorHandler);
  });
});

fs.readdir(outputDir, (err, newFiles) => { 
  errorHandler(err);
  fs.readdir(inputDir, (err, oldFiles) => {
    errorHandler(err);
    newFiles.forEach(file => {
      if (!oldFiles.includes(file)){
        fs.unlink(path.join(outputDir, file), errorHandler);
      }});
  });
});

function errorHandler(err) {
  if (err) throw err;
}