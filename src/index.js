const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://comic.kukudm.com/comiclist/1694/index.htm', {
        waitUntil: 'domcontentloaded',
        timeout: 3000000
    });

    let aTag = await page.evaluate(() => {
        let as = [...document.querySelectorAll('#comiclistn dd a')].filter(v => v.innerHTML.indexOf('食戟之灵') !== -1);
        return as.map((a) => {
            return {
                href: a.href.trim(),
                //text: a.text.match(/.*?(\d+)/)[1]
                text: a.text
            }
        });
    });

    const i = aTag[0];
    //for (let i of aTag) {
    const name = i.text;
    const base = i.href.replace(/\d+\.htm/, '');
    const imgs = [];
    await page.goto(i.href, {
        waitUntil: 'domcontentloaded',
        timeout: 3000000
    });
    //let totalNum = 0;;
    let currentNum = 0;
    let totalNum = await page.evaluate(() => {
        let num = document.querySelectorAll('table tr td')[1].innerText.match(/共(\d+)页/)[1];
        console.log(num);
        return num;
        //totalNum = parseInt(num, 10) | 0;
    });
    console.log(totalNum);

    for (let i = currentNum + 1; i < totalNum; i++) {
        const link = `${base}${i}.htm`;
        console.log(link);
        await page.goto(link, {
            waitUntil: 'domcontentloaded',
            timeout: 3000000
        });
        await(2000);
        const img = await page.evaluate(() => {
            return document.querySelector('img').src;
        });
        imgs.push(img);
    }
    console.log(imgs);
    //}

    await browser.close();
})();
