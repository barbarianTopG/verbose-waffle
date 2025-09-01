import chromium from "chrome-aws-lambda";

export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    res.status(400).send("Missing URL parameter");
    return;
  }

  let browser = null;
  try {
    // Launch headless Chromium from chrome-aws-lambda
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true
    });

    const page = await browser.newPage();

    // Optional: set a real browser User-Agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
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
    if (browser !== null) {
      await browser.close();
    }
  }
}
