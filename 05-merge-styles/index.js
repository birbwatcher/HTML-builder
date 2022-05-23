const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const readline = require('readline');
let bundle = [];

function getFiles() {
    return fsPromises.readdir(path.join(__dirname, 'styles'),{withFileTypes: true}).then(function(response, err){
        
        let onlyStyles = response.filter(function(item, i) {
            return path.extname(response[i].name.toString()) === '.css';
        })
        // console.log(onlyStyles);
        onlyStyles.forEach(function(item, i, array) {
            let readStream = fs.createReadStream(path.join(__dirname, '\\styles\\style-'+[i+1]+'.css'), 'utf-8');
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
                    
                    let writeStream = fs.createWriteStream(path.join(__dirname, '\\project-dist\\bundle.css'));

                    var rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                      });

                      bundle.forEach(function(item, index){
                        writeStream.write(item);
                      })
                    }
             });
            //console.log(data[i]);
            //return bundle.push(data[i]);

        });
        //console.log(bundle);
    });
}

getFiles();
