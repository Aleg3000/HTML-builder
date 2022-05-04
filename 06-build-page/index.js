const fs = require('fs').promises;
const path = require('path');

const pathToProject = path.join(__dirname, 'project-dist');
const pathToComponents = path.join(__dirname, 'components');
const pathToStylesSource = path.join(__dirname, 'styles');
const pathToHTMLSource = path.join(__dirname, 'template.html');
fs.mkdir(pathToProject, { recursive: true });

async function makeBundle() {
  makeHTML(pathToHTMLSource);
  makeCSS(pathToStylesSource);
}

async function readComponents(dir) {
  let files = (await fs.readdir(dir, { withFileTypes: true}))
    .filter(el => el.isFile() && path.extname(el.name).toLowerCase() === '.html')
    .map(file => file.name);
  let filesContent = await Promise.all(files.map(file => fs.readFile(path.join(dir, file), 'utf-8')));
  return files.map((file, i) => ({component: file.split('.')[0], content: filesContent[i]}));
}


async function makeHTML(source) {
  let template = await fs.readFile(source, 'utf-8');
  let contentToReplace = await readComponents(pathToComponents);
  let newHTML = contentToReplace.reduce((acc, content) => acc.replace(`{{${content.component}}}`, content.content), template);
  fs.writeFile(path.join(pathToProject, 'index.html'), newHTML);
}

async function makeCSS(source) {
  let styles = await fs.readdir(source);
  styles = await Promise.all(styles.map(file => fs.readFile(path.join(source, file), 'utf-8')));
  fs.writeFile(path.join(pathToProject, 'styles.css'), styles);
}

makeBundle();