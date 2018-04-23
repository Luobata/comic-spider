const fs = require('fs');
const util = require('../util');
const path = require('path');

const base = 'src/dir/data/annotation/index.json_2013-06-17%2012/43/44.892146';
const b2 = 'src/dir/data/annotation/';

(async () => {
    const s = await util.stat(base);
    const a = path.resolve(__dirname, b2);
    console.log(a);
    console.log(s);
    console.log(s.isFile());
})();
