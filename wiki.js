const fs = require('fs-extra')
const path = require('path')
fs.copySync(path.join(__dirname, 'docs'), path.join(__dirname, 'wiki','docs'))