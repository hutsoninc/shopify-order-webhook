const path = require('path');

const filePath = path.join(__dirname, 'index.js');
const secretsFile = '.secrets';
const name = 'shopify-order-webhook';

const argv = process.argv.slice(2);
const input = process.argv.slice(0, 2);

module.exports = {
    argv,
    filePath,
    input,
    name,
    secretsFile,
};
