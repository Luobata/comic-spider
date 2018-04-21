const fs = require('fs');

module.exports = {
    stat: path => {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err, stats) => {
                // if (err) resolve(err);
                resolve(stats);
            });
        });
    },
    open: path => {
        return new Promise((resolve, reject) => {
            fs.open(path, (err, opens) => {
                //if (err) reject(err);
                resolve(opens);
            });
        });
    },
};
