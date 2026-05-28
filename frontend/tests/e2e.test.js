// frontend/tests/e2e.test.js
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  try {
    // 1. Open the landing page
    await page.goto('http://localhost:3000', {waitUntil: 'networkidle2'});

    // 2. Navigate to registration (assumes /register route)
    await page.waitForSelector('a[href="/register"]');
    await page.click('a[href="/register"]');
    await page.waitForNavigation({waitUntil: 'networkidle2'});

    // 3. Fill registration form (assumes fields with names "email" and "password")
    await page.type('input[name="email"]', 'test@africau.edu');
    await page.type('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({waitUntil: 'networkidle2'});

    // 4. Login (if registration auto‑login, skip)
    // Assume redirected to dashboard after registration

    // 5. Create a project (assumes a button with data-testid="create-project" and a modal with input[name="projectName"])
    await page.waitForSelector('[data-testid="create-project"]');
    await page.click('[data-testid="create-project"]');
    await page.waitForSelector('input[name="projectName"]');
    await page.type('input[name="projectName"]', 'Demo Project');
    await page.click('button[data-testid="confirm-create"]');
    await page.waitForTimeout(1000); // wait for creation

    // 6. Open messaging within the project (assumes route /project/[id]/chat)
    // Grab first project link
    const projectLink = await page.$('a[data-testid="project-link"]');
    if (projectLink) {
      await projectLink.click();
      await page.waitForNavigation({waitUntil: 'networkidle2'});
    }

    // 7. Send a chat message (assumes textarea[name="message"] and button[data-testid="send-message"])
    await page.waitForSelector('textarea[name="message"]');
    await page.type('textarea[name="message"]', 'Hello from automated test');
    await page.click('button[data-testid="send-message"]');
    await page.waitForTimeout(1000);

    console.log('✅ End‑to‑end test passed');
  } catch (err) {
    console.error('❌ End‑to‑end test failed', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
