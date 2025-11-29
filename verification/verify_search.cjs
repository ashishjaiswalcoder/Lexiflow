
const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        console.log('Navigating to app...');
        await page.goto('http://127.0.0.1:8080');

        // Wait for search input
        await page.waitForSelector('#search-input');

        // Type "peace" to trigger search-as-you-type
        console.log('Typing "peace"...');
        await page.fill('#search-input', 'peace');

        // Wait for results to appear (search-as-you-type should trigger)
        console.log('Waiting for results...');
        await page.waitForSelector('#result-container h2', { state: 'visible', timeout: 5000 });

        const word = await page.textContent('#result-container h2');
        console.log(`Found word: ${word}`);

        if (word.toLowerCase() !== 'peace') {
            throw new Error(`Expected word "peace", found "${word}"`);
        }

        // Take screenshot
        const screenshotPath = path.join(__dirname, 'verification.png');
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Screenshot saved to ${screenshotPath}`);

    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
