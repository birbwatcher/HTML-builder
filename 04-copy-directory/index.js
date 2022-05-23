const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

// async function rmDir() {
//   await fsPromises.rm(path.join(__dirname, 'files-copy'),{ recursive: true, force: true });
// }

// async function mkDir() {
// //  rmDir();
//  await fsPromises.mkdir(path.join(__dirname, 'files-copy'),{recursive: true})
// }

// async function getFiles () {
//     mkDir();
//     let readDir = await fsPromises.readdir(path.join(__dirname, 'files'),{withFileTypes: true});
//     readDir.forEach((el, i) => {
//         fsPromises.copyFile(path.join(`${__dirname}\\files`, readDir[i].name), path.join(`${__dirname}\\files-copy`, readDir[i].name))
//     });
// }

// getFiles();

function justTry(){
  fsPromises.rm(path.join(__dirname, 'files-copy'),{ recursive: true, force: true }).then(res => {mkDir()})
}

justTry();

function mkDir() {
  //  rmDir();
   fsPromises.mkdir(path.join(__dirname, 'files-copy'),{recursive: true}).then(res => getFiles());
  }

async function getFiles () {
    mkDir();
    let readDir = await fsPromises.readdir(path.join(__dirname, 'files'),{withFileTypes: true});
    readDir.forEach((el, i) => {
        fsPromises.copyFile(path.join(`${__dirname}\\files`, readDir[i].name), path.join(`${__dirname}\\files-copy`, readDir[i].name))
    });
}



