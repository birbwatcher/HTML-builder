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
        fsPromises.mkdir(path.join(__dirname, 'project-dist'),{recursive: true}).then(res => getIndex());

    }
    mkDir();
    // copyFiles();

    function getIndex() {
            let writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist/index.html'));
            var rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
              });
              writeStream.write(indexTemplate);
              getStyles();
    }


    // console.log(indexTemplate);
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
                console.log(chunk);
                data += chunk;
                console.log(data, 'data')
            });
            readStream.on('end',function() {
                bundle.push(data);

                console.log(bundle, 'end version');

                if (onlyStyles.length === i + 1) {
                    
                    let writeStream = fs.createWriteStream(path.join(__dirname, '\\project-dist\\style.css'));

                    var rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                      });

                      bundle.forEach(function(item, index){
                        writeStream.write(item);
                      })
                    }
             });

        });
    });
}


// async function copyFiles() {
//     // mkDir();
//     let readDir = await fsPromises.readdir(path.join(__dirname, 'assets'),{withFileTypes: true});
//     readDir.forEach((el, i) => {
//         fsPromises.copyFile(path.join(`${__dirname}\\assets`, readDir[i].name), path.join(`${__dirname}\\project-dist`, readDir[i].name))
//     });
// }








// async function getComponents() {
//     let files = [];
//     let readDir = await fsPromises.readdir(path.join(__dirname, 'components'),{withFileTypes: true})
//     readDir.forEach(function(item,index){
//         console.log(item);
//     });
// }

// getComponents()

