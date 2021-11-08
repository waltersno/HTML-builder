const fs = require('fs');
const path = require('path');

const fullPathToText = path.join(__dirname, '/files');

function callback(err) {
  if (err) {
    console.log(err);
  }
}

fs.readdir(fullPathToText, { withFileTypes: false }, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    fs.access(__dirname + '/files-copy', (error) => {
      if (error) {
        fs.mkdir(__dirname + '/files-copy', (error) => {
          if (error) {
            console.log(error);
          } else {
            files.forEach((file) => {
              fs.copyFile(
                __dirname + `/files/${file}`,
                __dirname + `/files-copy/${file}`,
                callback
              );
            });
          }
        });
      } else {
        fs.readdir(
          __dirname + '/files-copy',
          { withFileTypes: false },
          (err, filesOld) => {
            if (err) throw err;

            for (const file of filesOld) {
              fs.unlink(path.join(__dirname + '/files-copy', file), (err) => {
                if (err) throw err;
              });
            }
          }
        );
        setTimeout(() => {
          files.forEach((file) => {
            fs.copyFile(
              __dirname + `/files/${file}`,
              __dirname + `/files-copy/${file}`,
              callback
            );
          });
        }, 500);
      }
    });
  }
});
