const fs = require('fs');
const path = require('path');


const stylesPath = path.join(__dirname, 'styles');
const projectDist = path.join(__dirname, 'project-dist');

fs.unlink(path.join(projectDist, 'bundle.css'),(err) => {
  if (err) console.log('no file');
});
// сделать нормальную проверку на наличие бандла
fs.readdir(stylesPath,{withFileTypes: true}, (err, files) => {
  if (err) throw err;
  files.filter(file => file.isFile() && file.name.split('.').slice(-1) == 'css')
    .map(dirent => dirent.name)
    .forEach(function(file){
      let readableStream = fs.createReadStream(path.join(stylesPath, file));
      readableStream.on('data', data => {
        fs.appendFile(path.join(projectDist, 'bundle.css'), data, err => {
          if (err) throw err;
        });
      });
    });
});