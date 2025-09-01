import puppeteer from "puppeteer";

export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    res.status(400).send("Missing URL parameter");
    return;
  }

  let browser;
  try {
    // Launch Puppeteer with default bundled Chromium
    browser = await puppeteer.launch({
      headless: true,
      executablePath: puppeteer.executablePath(),
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-zygote",
        "--single-process"
      ]
    });

    const page = await browser.newPage();

    // Optional: set a real browser User-Agent
    await page.setUserAgent(
      "Roblox/WinInet"
    );

    // Navigate to the page
    await page.goto(targetUrl, { waitUntil: "networkidle2" });

    // Wait a short time for InfiniteFree JS to execute (AES + cookie)
    await page.waitForTimeout(1000);

    // Get page content
    const content = await page.content();

    res.status(200).send(content);

  } catch (err) {
    console.error("Puppeteer error:", err);
    res.status(500).send("Proxy error: " + err.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
