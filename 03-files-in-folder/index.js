const fs = require('fs');
const path = require('path');
const folderForTest = path.join(__dirname, 'secret-folder');

fs.readdir(folderForTest, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  for (let file of files) {
    if (file.isFile()) {
      let filesFolder = path.join(__dirname, `secret-folder/${file.name}`);
      fs.stat(filesFolder, (err, stats) => {
        if (err) throw err;
        console.log(`${path.basename(file.name)} - ${stats.size / 1000 + 'kb'}`);
      });
    }
  }
});
