const fs = require('fs');

function getSidebar() {
  const mainSidebar = JSON.parse(fs.readFileSync('docs/.vuepress/sidebar.json'));

  for (const mainSidebarItem of mainSidebar) {
    const docPath = 'docs' + mainSidebarItem.path;

    if (fs.lstatSync(docPath).isDirectory()) {
      const sidebarPath = docPath + '.vuepress/sidebar.json';
      const sidebar = JSON.parse(fs.readFileSync(sidebarPath));

      for (const sidebarItem of sidebar) {
        sidebarItem.path = mainSidebarItem.path.slice(0, -1) + sidebarItem.path;
      }

      mainSidebarItem.children = sidebar;
    }
  }

  return mainSidebar;
}

module.exports = {
  getSidebar
};