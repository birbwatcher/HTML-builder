const fs = require('fs');
const path = require('path');

let data = '';

let readStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
readStream.on('data', function(chunk) {
    data += chunk;
    console.log(data);
})