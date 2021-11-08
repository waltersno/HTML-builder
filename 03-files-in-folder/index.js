const fs = require('fs');
const path = require('path');

const fullPathToText = path.join(__dirname, '/secret-folder');

fs.readdir(fullPathToText, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  else {
    files.forEach((file) => {
      if (!file.isDirectory()) {
        fs.stat(fullPathToText + `/${file.name}`, (err, stats) => {
          if (err) {
            console.log(err);
          } else {
            console.log(
              path.basename(file.name, path.extname(file.name)) + ' -',
              path.extname(file.name) + ' - ',
              stats.size / 1000 + ' KB'
            );
            // console.log(stats.size);
          }
        });
      }
    });
  }
});
