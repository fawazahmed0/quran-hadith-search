const fs = require('fs-extra')
const path = require('path')
if(process.env.TEST_BUILD) 
fs.copySync(path.join(__dirname, 'testdocs'), path.join(__dirname, 'docs'))
// copy docs to build folder, so that edit this page can work
fs.copySync(path.join(__dirname, 'docs'), path.join(__dirname, 'build','docsdata','docs'))
//fs.copySync(path.join(__dirname, 'blog'), path.join(__dirname, 'build','docsdata','blog'))
