const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const readline = require('readline');
let bundle = [];

async function getFiles() {
    let componentFiles = await fsPromises.readdir(path.join(__dirname, 'components'),{withFileTypes: true})
    let dataBase = {};
    let indexTemplate = await getTemplate('template.html');
    for (let index=0;index<componentFiles.length;index++) {
        dataBase[path.basename(componentFiles[index].name.toString(), path.extname(componentFiles[index].name.toString()))] = await getTemplate('components/' + componentFiles[index].name);
    }
    if (indexTemplate.includes('{{header}}')){
        indexTemplate = indexTemplate.replace('{{header}}', dataBase.header)
    }
    if (indexTemplate.includes('{{articles}}')){
        indexTemplate = indexTemplate.replace('{{header}}', dataBase.articles)
    }
    if (indexTemplate.includes('{{footer}}')){
        indexTemplate = indexTemplate.replace('{{footer}}', dataBase.articles)
    }
    if (indexTemplate.includes('{{about}}')){
        indexTemplate = indexTemplate.replace('{{about}}', dataBase.articles)
    }

    function mkDir() {
        //  rmDir();
        //  fsPromises.mkdir(path.join(__dirname, 'project-dist'),{recursive: true}).then(res => getFiles());
        fsPromises.mkdir(path.join(__dirname, 'project-dist'),{recursive: true, force:true}).then(res => getIndex()).then(res => copyFiles());
        fsPromises.mkdir(path.join(__dirname, 'project-dist/assets'),{recursive: true, force:true});
        fsPromises.mkdir(path.join(__dirname, 'project-dist/assets/img'),{recursive: true, force:true})
        fsPromises.mkdir(path.join(__dirname, 'project-dist/assets/svg'),{recursive: true, force:true})
        fsPromises.mkdir(path.join(__dirname, 'project-dist/assets/fonts'),{recursive: true, force:true})
        
    }
    mkDir();
    

    function getIndex() {
            let writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist/index.html'));
            var rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
              });
              writeStream.write(indexTemplate);
              getStyles();
    }

}

getFiles();


// read template
function getTemplate(pathToFile) {
    let readStream = fs.createReadStream(path.join(__dirname, pathToFile), 'utf-8');
    let template = new Promise ((resolve, reject) => {
        let data = '';
        readStream.on('data', function(chunk) {
            data += chunk;
        });
        readStream.on('end', function() {
            resolve(data);
        });
    })
    return template;
}


//get styles
function getStyles() {
    return fsPromises.readdir(path.join(__dirname, 'styles'),{withFileTypes: true}).then(function(response, err){
        
        let onlyStyles = response.filter(function(item, i) {
            return path.extname(response[i].name.toString()) === '.css';
        })
        onlyStyles.forEach(function(item, i, array) {
            let readStream = fs.createReadStream(path.join(__dirname, '\\styles\\' + item.name), 'utf-8');
            let data = '';
            readStream.on('data', function(chunk) {
                data += chunk;
            });
            readStream.on('end',function() {
                bundle.push(data);


                if (onlyStyles.length === i + 1) {
                    
                    let writeStream = fs.createWriteStream(path.join(__dirname, '\\project-dist\\style.css'));

                    var rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                      });

                      bundle.forEach(function(item, index){
                        writeStream.write(item);
                      })
                      rl.close();
                    }
                    
             });

        });
    });
}


async function copyFiles() {
    // mkDir();
    let readDir = await fsPromises.readdir(path.join(__dirname, 'assets\\fonts'),{withFileTypes: true});
    readDir.forEach((el, i) => {
        if (el.isFile) {
            fsPromises.copyFile(path.join(`${__dirname}\\assets\\fonts`, readDir[i].name), path.join(`${__dirname}\\project-dist\\assets\\fonts`, readDir[i].name))
        }
        if (el.isDirectory){
        }
    });

    let readImg = await fsPromises.readdir(path.join(__dirname, 'assets\\img'),{withFileTypes: true});
    readImg.forEach((el, i) => {
        if (el.isFile) {
            fsPromises.copyFile(path.join(`${__dirname}\\assets\\img`, readImg[i].name), path.join(`${__dirname}\\project-dist\\assets\\img`, readImg[i].name))
        }
        if (el.isDirectory){
        }
    });

    let readSvg = await fsPromises.readdir(path.join(__dirname, 'assets\\svg'),{withFileTypes: true});
    readSvg.forEach((el, i) => {
        if (el.isFile) {
            fsPromises.copyFile(path.join(`${__dirname}\\assets\\svg`, readSvg[i].name), path.join(`${__dirname}\\project-dist\\assets\\svg`, readSvg[i].name))
        }
        if (el.isDirectory){
        }
    });

}








// async function getComponents() {
//     let files = [];
//     let readDir = await fsPromises.readdir(path.join(__dirname, 'components'),{withFileTypes: true})
//     readDir.forEach(function(item,index){
//         console.log(item);
//     });
// }

// getComponents()

