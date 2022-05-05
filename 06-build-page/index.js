const fs = require('fs').promises;
const path = require('path');

const pathToProject = path.join(__dirname, 'project-dist');
const pathToComponents = path.join(__dirname, 'components');
const pathToStylesSource = path.join(__dirname, 'styles');
const pathToHTMLSource = path.join(__dirname, 'template.html');
const pathToAssets = path.join(__dirname, 'assets');
const pathToDistAssets = path.join(__dirname, 'project-dist', 'assets');

async function makeBundle() {
  await fs.mkdir(pathToProject, { recursive: true });
  await delDir(pathToProject);
  await makeHTML(pathToHTMLSource);
  await makeCSS(pathToStylesSource);
  await copyDir(pathToAssets, pathToDistAssets);
}

async function delDir(source) {
  const files = await fs.readdir(source);
  files.map((file) => fs.rm(path.join(source, file), { recursive: true }));
}

async function copyDir(from, to) {
  await fs.mkdir(to, { recursive: true});
  const files = await fs.readdir(from, { withFileTypes: true});
  files.forEach(dirent => {
    dirent.isFile() ? fs.copyFile( path.join(from, dirent.name) , path.join(to, dirent.name)) : copyDir(path.join(from, dirent.name), path.join(to, dirent.name));
  });
}

async function readComponents(dir) {
  const files = (await fs.readdir(dir, { withFileTypes: true}))
    .filter(el => el.isFile() && path.extname(el.name).toLowerCase() === '.html')
    .map(file => file.name);
  const filesContent = await Promise.all(files.map(file => fs.readFile(path.join(dir, file), 'utf-8')));
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
  await fs.writeFile(path.join(pathToProject, 'style.css'), styles.join('\n'));
}

makeBundle();
