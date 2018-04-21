const puppeteer = require('puppeteer');
const fs = require('fs');
const util = require('../util');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = 'http://sun3d.cs.princeton.edu/data/hotel_umd/maryland_hotel3/';
    const whitelist = [
        'Name',
        'Last modified',
        'Size',
        'Description',
        'Parent Directory',
    ];
    const base = `src/dir/data`;
    const walk = async url => {
        (async () => {
            console.log(url);
            console.log(2);
            await page.goto(url, {
                waitUntil: 'domcontentloaded',
                timeout: 3000000,
            });
            console.log(1);
            const tags = await page.evaluate(() => {
                let as = [...document.querySelectorAll('a')].filter(
                    v => whitelist.indexOf(v.text) !== -1,
                );
                return as.map(a => {
                    return {
                        href: a.href.trim(),
                        //text: a.text.match(/.*?(\d+)/)[1]
                        text: a.text,
                        type: a.text.match(/\/$/) ? 'dir' : 'file',
                    };
                });
            });
            return tags;
        })();
    };
    const download = async url => {
        (async () => {
            console.log(url);
        })();
    };

    const spider = async (url, base) => {
        (async () => {
            const aTag = await walk(url);
            console.log(aTag);
            for (let j = 0; j < aTag.length; j++) {
                const i = aTag[j];
                const name = i.text;
                const type = i.type;
                const href = i.href;
                const fileAddress = `${base}/${name}`;
                try {
                    console.log(name);
                    const fileStat = await util.stat(fileaddress);
                    // 存在跳过
                    if (fileStat && fileStat.isFile()) {
                        continue;
                    }
                    if (type === 'dir') {
                        fs.mkdirSync(fileAddress);
                        await spider(href, fileAddress);
                    } else {
                        await download(href);
                    }
                    await page.goto(i.href, {
                        waitUntil: 'domcontentloaded',
                        timeout: 3000000,
                    });
                } catch (e) {
                    await 50000;
                    console.log(e);
                    console.log(`${name} passed`);
                    //j--;
                    //fs.unlinkSync(htmlDir, re);
                }
            }
        })();
    };
    await spider(url, base);

    await browser.close();
})();
