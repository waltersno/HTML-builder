const fs = require('fs');
const path = require('path');

let data = [];
let logger;

fs.access(__dirname + '/project-dist/bundle.css', (err) => {
  if (err) {
    logger = fs.createWriteStream(__dirname + '/project-dist/bundle.css', {
      flags: 'a',
    });
  } else {
    fs.unlink(path.join(__dirname + '/project-dist/bundle.css'), (err) => {
      if (err) {
        console.log(err);
      }
    });
    logger = fs.createWriteStream(__dirname + '/project-dist/bundle.css', {
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
          console.log(file);
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