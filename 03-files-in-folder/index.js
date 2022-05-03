const fs = require('fs');
const path = require('path');

const secretFolder = path.join(__dirname, 'secret-folder');

async function readDir(dir){
  const files = await (await fs.promises.readdir(dir, {withFileTypes: true}))
    .filter(el => el.isFile())
    .map(el => el.name);
  files.forEach(el => {
    fs.stat(path.join(dir, el), (err, stats) => {
      if (err) throw err;
      console.log(`<${path.parse(el).name}>-<${path.extname(el).slice(1)}>-<${stats.size}b>`);}
    );
  });
}

readDir(secretFolder);

// Данные должны быть выведены в формате <имя файла>-<расширение файла>-<вес файла>