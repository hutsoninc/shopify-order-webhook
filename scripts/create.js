const execa = require('execa');
const config = require('../config');

const create = async () => {
    try {
        execa('wt', [
            'create',
            '--secrets-file',
            config.secretsFile,
            '--name',
            config.name,
            ...config.argv,
            config.filePath,
        ]).stdout.pipe(process.stdout);
    } catch (err) {
        console.error(err.message);
        process.exit(err.exitCode);
    }
};

create();
