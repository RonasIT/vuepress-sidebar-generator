const fs = require('fs');
const { resolve } = require('path');

function getFiles(dir) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });

  let result = [];
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory() || dirent.isSymbolicLink()) {
      result = result.concat(getFiles(res));
    } else {
      result = result.concat(res);
    }
  }

  return result;
}

function addNameToPath(sidebar, name) {
  sidebar.forEach((item, key) => {
    if (item.hasOwnProperty('children')) {
      addNameToPath(item.children, name);
    } else {
      sidebar[key].path = '/' + name + item.path;
    }
  });
}

function getSidebar() {
  const mainSidebar = JSON.parse(fs.readFileSync('docs/.vuepress/sidebar.json'));

  const files = getFiles('docs').filter((file) => file.indexOf('sidebar.json') > -1);

  files.forEach((file) => {
    const sidebar = JSON.parse(fs.readFileSync(file));

    const parts = file.split('/');
    const name = parts[parts.length - 3];
    if (name !== 'docs') {
      addNameToPath(sidebar, name);

      const itemIndexInMainSidebar = mainSidebar.findIndex((item) => item.path.indexOf(name) > -1);
      mainSidebar[itemIndexInMainSidebar].children = sidebar;
    }
  });

  return mainSidebar;
}

module.exports = {
  getSidebar
};