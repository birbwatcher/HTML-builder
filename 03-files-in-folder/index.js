const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

async function getDirInfo() {
    let readDir = await fsPromises.readdir(path.join(__dirname, 'secret-folder'),{withFileTypes: true});
    let onlyFiles = readDir.filter(dirent => !dirent.isDirectory());
    let sizes = [];
    onlyFiles.forEach((el, i) => {
        let fileExt = path.extname(onlyFiles[i].name.toString());
        let fileName = path.basename(onlyFiles[i].name.toString(), path.extname(onlyFiles[i].name.toString()));
            fs.stat(path.join(__dirname + '\\secret-folder', onlyFiles[i].name.toString()), (error, stats) => {
            if (error) {
              console.log(error);
            }
            if (stats) {
               sizes.push(stats.size/1024 + 'kB')
               const actualPromise = fs.promises.stat(path.join(__dirname + '\\secret-folder', onlyFiles[i].name.toString()), (error, stats) => {
                if (error) {
                  console.log(error);
                }
                if (stats) {
                   sizes.push(stats.size + 'kB')
                }
            }).then(() => console.log(`${fileName} - ${fileExt.slice(1)} - `+ sizes[i]));
            }
        });
    })
}



getDirInfo()
