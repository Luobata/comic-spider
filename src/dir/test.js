const fs = require('fs');
const util = require('../util');

const base = 'src/dir/data/image2';

(async () => {
    const s = await util.stat(base);
    console.log(s);
    console.log(s.isDirectory());
})();
