const path = require('path');
const fs = require('fs');
const { stdout } = require('process');

const textName = 'text.txt';
const fullPathToText = path.join(__dirname, textName);

const textStream = fs.createReadStream(fullPathToText);
textStream.on('data', (data) => {
  stdout.write(data);
});
