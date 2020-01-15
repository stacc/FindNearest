const csvToJson = require('convert-csv-to-json');

const input = './dokart.csv';
const output = './public/dokart.json';

csvToJson.generateJsonFileFromCsv(input, output);