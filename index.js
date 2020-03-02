const fs = require('fs');

function getSidebar(language = null) {
  let sidebarFileName = 'sidebar';
  if (language !== null) {
    sidebarFileName = `${sidebarFileName}.${language}`;
  }

  sidebarFileName = `${sidebarFileName}.json`;

  const mainSidebar = JSON.parse(fs.readFileSync(`docs/.vuepress/${sidebarFileName}`));

  for (const mainSidebarItem of mainSidebar) {
    const docPath = 'docs' + mainSidebarItem.path;

    if (fs.lstatSync(docPath).isDirectory()) {
      const sidebarPath = `${docPath}.vuepress/${sidebarFileName}`;
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