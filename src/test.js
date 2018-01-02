const pug = require('pug');
const fs = require('fs');

const arr = [1, 2, 3, 4];
const compiled = pug.compileFile('src/tpl/tpl.pug', {
    pretty: true,
});
const re = compiled({
    data: arr
});
console.log(re);
fs.writeFileSync('src/data/1.html', re);
