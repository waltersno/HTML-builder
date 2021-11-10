const fs = require('fs');
const path = require('path');

const templateReg = /{{[a-zA-X0-9]+}}/g;
const fullPathToAssets = path.join(__dirname, '/assets');
let dataTemplate = [];
let dataComponents = [];
let newTemplate;
let indexHtml;

let data = [];
let logger;

//index.html
const createTemplateHtml = (item) => {
  const readStream = fs.createReadStream(
    path.join(__dirname, '/template.html')
  );

  readStream
    .on('data', function (chunk) {
      dataTemplate.push(chunk);
      newTemplate = dataTemplate[0].toString() + '';
    })
    .on('end', function () {
      const componentsList = dataTemplate[0].toString().match(templateReg);
      componentsList.forEach((itemComponent) => {
        if (itemComponent.includes(path.parse(item.file).name)) {
          newTemplate = newTemplate.replace(itemComponent, item.chunk);
        }
      });
    });
};

fs.readdir(
  path.join(__dirname, '/components'),
  { withFileTypes: false },
  (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach((file) => {
        const readStreamComponent = fs.createReadStream(
          path.join(__dirname, '/components') + `/${file}`,
          'utf8'
        );

        readStreamComponent
          .on('data', function (chunk) {
            dataComponents.push({ chunk, file });
          })
          .on('end', function () {
            dataComponents.forEach((item) => {
              createTemplateHtml(item);
            });
            // dataComponents = [];
          });
      });
    }
  }
);

fs.access(path.join(__dirname, '/project-dist'), (err) => {
  if (err) {
    fs.mkdir(path.join(__dirname, '/project-dist'), (error) => {
      if (error) {
        console.log(error);
      }
    });

    setTimeout(() => {
      indexHtml = fs.createWriteStream(__dirname + '/project-dist/index.html', {
        flags: 'a',
      });
      indexHtml.write(newTemplate);
    }, 500);
  } else {
    fs.rmdir(__dirname + '/project-dist', { recursive: true }, err => {
      if(err) throw err; 
    });
    setTimeout(() => {
      fs.mkdir(path.join(__dirname, '/project-dist'), (error) => {
        if (error) {
          console.log(error);
        }
      });
    }, 250);

    setTimeout(() => {
      indexHtml = fs.createWriteStream(__dirname + '/project-dist/index.html', {
        flags: 'a',
      });
      indexHtml.write(newTemplate);
    }, 500);
  }
});

//style.css
setTimeout(() => {
  fs.access(__dirname + '/project-dist/style.css', (err) => {
    if (err) {
      logger = fs.createWriteStream(__dirname + '/project-dist/style.css', {
        flags: 'a',
      });
    } else {
      fs.unlink(path.join(__dirname + '/project-dist/style.css'), (err) => {
        if (err) {
          console.log(err);
        }
      });
      logger = fs.createWriteStream(__dirname + '/project-dist/style.css', {
        flags: 'a',
      });
    }
  });

  fs.readdir(
    path.join(__dirname, '/styles'),
    { withFileTypes: false },
    (err, files) => {
      if (err) {
        console.log(err);
      } else {
        files.forEach((file) => {
          if (path.extname(file) === '.css') {
            const readStream = fs.createReadStream(
              path.join(__dirname, '/styles') + `/${file}`,
              'utf8'
            );

            readStream
              .on('data', function (chunk) {
                data.push(chunk);
              })
              .on('end', function () {
                data.forEach((item) => {
                  logger.write(item);
                });
                data = [];
              });
          }
        });
      }
    }
  );

  fs.readdir(fullPathToAssets, { withFileTypes: true }, (err, files) => {
    fs.mkdir(__dirname + '/project-dist/assets', (makeDirErr) => {
      if (makeDirErr) {
        console.log(makeDirErr);
      }
    });
    files.forEach((file) => {
      if (file.isDirectory()) {
        fs.mkdir(
          __dirname + `/project-dist/assets/${file.name}`,
          (makeDirErr) => {
            if (makeDirErr) {
              console.log(makeDirErr);
            }
          }
        );
        fs.readdir(fullPathToAssets + '/' + file.name, (error, innerFiles) => {
          if (error) {
            console.log(error);
          } else {
            innerFiles.forEach((innerFile) => {
              fs.copyFile(
                fullPathToAssets + '/' + file.name + '/' + innerFile,
                __dirname + `/project-dist/assets/${file.name}/${innerFile}`,
                (err) => {
                  if (err) {
                    console.log(err);
                  }
                }
              );
            });
          }
        });
      }
    });
  });
}, 1000);
