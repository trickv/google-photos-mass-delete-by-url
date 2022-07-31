const puppeteer = require('puppeteer');
const browser = await puppeteer.launch()
const page = await browser.newPage()
const navigationPromise = page.waitForNavigation()

await page.goto('https://photos.google.com/photo/AF1QipMm8KV4UVWVmGq1eC2TfLXNoCBWMgESgtLNgou5')

await page.setViewport({ width: 1916, height: 956 })

await navigationPromise

await page.waitForSelector('span > .VfPpkd-ksKsZd-mWPk3d-OWXEXe-Tv8l5d-lJfZMc > .VfPpkd-kBDsod > .v1262d > path')
await page.click('span > .VfPpkd-ksKsZd-mWPk3d-OWXEXe-Tv8l5d-lJfZMc > .VfPpkd-kBDsod > .v1262d > path')

await page.waitForSelector('.mjANdc > .g3VIld > .XfpsVe > .VfPpkd-LgbsSe:nth-child(2) > .VfPpkd-Jh9lGc')
await page.click('.mjANdc > .g3VIld > .XfpsVe > .VfPpkd-LgbsSe:nth-child(2) > .VfPpkd-Jh9lGc')

await browser.close()
