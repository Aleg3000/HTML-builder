const fs = require('fs').promises;
const path = require('path');

const pathToProject = path.join(__dirname, 'project-dist');
const pathToComponents = path.join(__dirname, 'components');
const pathToHTMLSource = path.join(__dirname, 'template.html');
fs.mkdir(pathToProject, { recursive: true });

async function makeBundle() {
  makeHTML(pathToHTMLSource);
}

async function readComponents(dir) {
  let files = (await fs.readdir(dir, { withFileTypes: true}))
    .filter(el => el.isFile() && path.extname(el.name).toLowerCase() === '.html')
    .map(file => file.name);
  let filesContentP = files.map(file => fs.readFile(path.join(dir, file), 'utf-8'));
  let filesContent = await Promise.all(filesContentP);
  return files.map((file, i) => ({component: file.split('.')[0], content: filesContent[i]}));
}


async function makeHTML(source) {
  let template = await fs.readFile(source, 'utf-8');
  let contentToReplace = await readComponents(pathToComponents);
  let newHTML = contentToReplace.reduce((acc, content) => acc.replace(`{{${content.component}}}`, content.content), template);
  fs.writeFile(path.join(pathToProject, 'index.html'), newHTML);
//   console.log(newHTML)
  // console.log(template);
}

makeBundle();