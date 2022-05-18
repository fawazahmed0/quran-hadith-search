const fs = require('fs-extra')
const path = require('path')
// copy docs to build folder, so that edit this page can work
fs.copySync(path.join(__dirname, 'docs'), path.join(__dirname, 'build','docsdata','docs'))