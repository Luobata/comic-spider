const puppeteer = require('puppeteer');
const pug = require('pug');
const fs = require('fs');
const util = require('./util');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://comic.kukudm.com/comiclist/1694/index.htm', {
        waitUntil: 'domcontentloaded',
        timeout: 3000000,
    });

    let aTag = await page.evaluate(() => {
        let as = [...document.querySelectorAll('#comiclistn dd a')].filter(
            v => v.innerHTML.indexOf('食戟之灵') !== -1,
        );
        return as.map(a => {
            return {
                href: a.href.trim(),
                //text: a.text.match(/.*?(\d+)/)[1]
                text: a.text,
            };
        });
    });

    //for (let i of aTag) {
    for (let j = 0; j < aTag.length; j++) {
        const i = aTag[j];
        const name = i.text;
        const base = i.href.replace(/\d+\.htm/, '');
        const imgs = [];
        const htmlDir = `src/data/${name}.html`;
        try {
            const fileStat = await util.stat(htmlDir);
            console.log(name);
            // 存在跳过
            if (fileStat && fileStat.isFile()) {
                continue;
            }
            await page.goto(i.href, {
                waitUntil: 'domcontentloaded',
                timeout: 3000000,
            });
            let currentNum = 0;
            let totalNum = await page.evaluate(() => {
                let num = document
                    .querySelectorAll('table tr td')[1]
                    .innerText.match(/共(\d+)页/)[1];
                return num;
            });
            console.log(name, totalNum);

            for (let i = currentNum + 1; i <= totalNum; i++) {
                const link = `${base}${i}.htm`;
                //console.log(link);
                await page.goto(link, {
                    waitUntil: 'domcontentloaded',
                    timeout: 3000000,
                });
                await 2000;
                const img = await page.evaluate(() => {
                    return document.querySelector('img').src;
                });
                imgs.push(img);
            }
            const compiled = pug.compileFile('src/tpl/tpl.pug', {
                pretty: true,
            });
            const re = compiled({
                data: imgs,
            });
            fs.writeFileSync(htmlDir, re);
        } catch (e) {
            await 50000;
            console.log(e);
            console.log(`${name} passed`);
            //j--;
            //fs.unlinkSync(htmlDir, re);
        }
        //console.log(imgs);
    }

    await browser.close();
})();
