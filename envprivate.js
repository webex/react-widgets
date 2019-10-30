require('dotenv').config();

let privateFile = process.env.PRIVATE_KEY;

console.log(privateFile);

privateFile = privateFile.replace(/\\n/g, '\n');
console.log(privateFile);

