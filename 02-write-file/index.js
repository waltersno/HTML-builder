const fs = require('fs');
const path = require('path');
process.stdin.setEncoding('utf8');

const textName = 'text.txt';
const fullPathToText = path.join(__dirname, textName);

const logger = fs.createWriteStream(fullPathToText, {
  flags: 'a',
});

console.log('Здравствуйте! Введите текст:');

process.on('SIGINT', function () {
  console.log('Завершаем запись!');
  logger.end();
  process.exit();
});

process.stdin.on('data', function (key) {
  if (key.toString().trim() == 'exit') {
    console.log('Завершаем запись!');
    logger.end();
    process.exit();
  }

  logger.write(`${key.toString().trim()}\n`);
});
