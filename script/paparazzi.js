// url settings
const url = /*'https://www.npmjs.com/package/puppeteer';*/ 'https://www.hannemaes.com/persistent/quartz/01/index.html?mode=light&ui=false';
const imageName = 'quartz01';
const imageWidth  = 1024;
const imageHeight = 1024;

// time settings
const interval = true;     // false: take 1 screenshot, true: take screenshots on time 
const intervalHours = 1;   // these settings only apply when interval == true
const intervalMinutes = 45;
const intervalSeconds = 0;

// technical settings
const timeoutMinutes = 30; // how long the script waits for the page to load before aborting the script
const waitBeforeScreenshotSeconds = 5; // wait after the page is loaded before taking a screenshot to be sure the page is fully loaded
const runOnPi = true; // running this script on a PI needs some different options, like chromium instaed of chrome

///***********************************************************************************************************************************
// MAIN SCRIPT

// require the puppeteer library
const puppeteer = require('puppeteer');

// take a screenshot
console.log(getDateAndTimeString() + ': script started');
async function takeScreenshot() {

    // get date and time for screenshot name
    const dateTimeString = getDateAndTimeString();
    const imagePath = 'screenshots/' + imageName + ' ' + dateTimeString + '.png';

    // log start
    console.log(dateTimeString + ': loading page...');

    // use puppeteer to take a screenshot
    var browserSettings = {};
    if(runOnPi) { browserSettings = { executablePath: 'chromium-browser' }; }
    
    const browser = await puppeteer.launch( browserSettings );
    const page = await browser.newPage();
    await page.goto(url, { timeout: timeoutMinutes * 60 * 1000 }); // the default timeout is 30,000 milliseconds (30 seconds).when the timeout runs out before the page is laoded, no screenshot is taken. So we make the timeout bigger
    await page.setViewport({ width: imageWidth, height: imageHeight });
    await page.waitForTimeout(waitBeforeScreenshotSeconds * 1000);
    await page.screenshot({
        path: imagePath,
        // fullPage: true, // true: capture the whole page, false: capture only the visible area
    });
    await browser.close();
    console.log(getDateAndTimeString() + ': screenshot taken');

}

// take a screenshot
takeScreenshot();

// take more screenshots if interval == true
if (interval == true) {
    const intervalMilliseconds = (intervalHours * 60 * 60 + intervalMinutes * 60 + intervalSeconds) * 1000; // convert hours, minutes, and seconds to milliseconds
    setInterval(takeScreenshot, intervalMilliseconds);
}


//***********************************************************************************************************************************
// FUNCTIONS

function getDateAndTimeString() {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}-${date.getSeconds().toString().padStart(2, '0')}`;
    
    return `${formattedDate} ${formattedTime}`;
}
