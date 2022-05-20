const fs = require('fs');
const readline = require('readline');
const { Stream } = require('stream');
const path = require('path');
const os = require('node:os');

let writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));


var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

console.log('Hello!')
newQuestion();
function newQuestion() {
    rl.question("Please type your text here:", function(answer) {
    if (answer === 'exit') {
        rl.close();
    } else {
        writeStream.write(answer + '\n', (err) => {
            if(err) {
                console.log(err.message);
            }
        })
        newQuestion();
    }
  });
}

process.on('exit', () => {
    console.log("\nBye! Have a nice day!");
  });