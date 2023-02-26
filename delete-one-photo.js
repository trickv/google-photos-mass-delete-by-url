const puppeteer = require('puppeteer');

const wsChromeEndpointurl = process.argv[2]

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
    let response = await page.goto(process.argv[3])
    if (response.status() != 200) {
        console.log("page is not 200, it returned " + response.status() + ", skipping")
        page.close()
        process.exit(2)
    }

    //await page.setViewport({ width: 1916, height: 956 })

    await navigationPromise

    /*await page.waitForSelector('span > .VfPpkd-ksKsZd-mWPk3d-OWXEXe-Tv8l5d-lJfZMc > .VfPpkd-kBDsod > .v1262d > path')
    await page.click('span > .VfPpkd-ksKsZd-mWPk3d-OWXEXe-Tv8l5d-lJfZMc > .VfPpkd-kBDsod > .v1262d > path')

    await page.waitForSelector('.mjANdc > .g3VIld > .XfpsVe > .VfPpkd-LgbsSe:nth-child(2) > .VfPpkd-vQzf8d')
    await page.click('.mjANdc > .g3VIld > .XfpsVe > .VfPpkd-LgbsSe:nth-child(2) > .VfPpkd-vQzf8d')*/

    page.keyboard.press("i") // show the details pane, to see if this photo is in an album
    await delay(2000)
    // let albumPresent = (await page.$('.KlIBpb > .wiOkb')) || "no"
    //page.waitForSelector(".KlIBpb > .wiOkb", { visible: true })
    let albumPresent = (await page.$('.KlIBpb > .wiOkb')) || "no"
    //let albumPresent = await page.waitForXPath('//*[contains(text(), "Albums")]') || "no";
    if (albumPresent == "no") {
        console.log("Not in any albums, will delete: " + process.argv[3])
    } else {
        console.log("It's in an album, skip! " + process.argv[3])
        page.keyboard.press("i") // hide the details pane
        await delay(500)
        page.close()
        process.exit(1)
    }
    page.keyboard.press("i") // hide the details pane
    await delay(1000)
    page.keyboard.press("#")
    await delay(500)
    page.keyboard.press("Enter")
    await delay(500)
    page.close()
    process.exit(0)

    //await browser.close()
})()
