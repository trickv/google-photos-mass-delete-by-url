const puppeteer = require('puppeteer');

const wsChromeEndpointurl = 'ws://127.0.0.1:9222/devtools/browser/af938b1c-840e-4462-861c-b743bfb0fcd5';

function delay(time) {
   return new Promise(function(resolve) {
       setTimeout(resolve, time)
   });
}

(async() => {
    //const browser = await puppeteer.launch({ headless: false })
    const browser = await puppeteer.connect({
        browserWSEndpoint: wsChromeEndpointurl,
    });
    const page = await browser.newPage()
    const navigationPromise = page.waitForNavigation()
    //page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36");
    //await page.goto('http://ip.v9n.us/')
    //await page.goto('https://photos.google.com/lr/photo/AIZWZ9cSzfLnTVP3OFx3StH03GBri5mF7C1btyWQ4GqRVqDWket5y8gNzeGpo0LtoVLWj-9wceDlQFkPZqMC5kr6S4Ea1m7jeA')
    await page.goto(process.argv[2])

    //await page.setViewport({ width: 1916, height: 956 })

    await navigationPromise

    /*await page.waitForSelector('span > .VfPpkd-ksKsZd-mWPk3d-OWXEXe-Tv8l5d-lJfZMc > .VfPpkd-kBDsod > .v1262d > path')
    await page.click('span > .VfPpkd-ksKsZd-mWPk3d-OWXEXe-Tv8l5d-lJfZMc > .VfPpkd-kBDsod > .v1262d > path')

    await page.waitForSelector('.mjANdc > .g3VIld > .XfpsVe > .VfPpkd-LgbsSe:nth-child(2) > .VfPpkd-vQzf8d')
    await page.click('.mjANdc > .g3VIld > .XfpsVe > .VfPpkd-LgbsSe:nth-child(2) > .VfPpkd-vQzf8d')*/
    page.keyboard.press("#")
    await delay(1000)
    page.keyboard.press("Enter")
    await delay(1000)
    page.close()
    process.exit(0)

    //await browser.close()
})()
