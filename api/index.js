import crypto from "crypto";

export default async function handler(req, res) {
  try {
    const keyHex = "f655ba9d09a112d4968c63579db590b4";
    const ivHex = "98344c2eee86c3994890592585b49f80";
    const cipherHex = "30a3c4df5fe6ae726f456b3b14437511";

    const key = Buffer.from(keyHex, "hex");
    const iv = Buffer.from(ivHex, "hex");
    const cipher = Buffer.from(cipherHex, "hex");

    const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
    let decrypted = decipher.update(cipher);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    const cookie = decrypted.toString("hex");

    const targetUrl = req.query.url;
    if (!targetUrl) {
      res.status(400).send("Missing URL parameter");
      return;
    }
    const fetchRes = await fetch(targetUrl, {
      headers: {
        "Cookie": `__test=${cookie}`,
        "User-Agent": "Roblox"
      }
    });

    const body = await fetchRes.text();
    res.status(200).send(body);

  } catch (err) {
    console.error(err);
    res.status(500).send("Proxy error");
  }
}
