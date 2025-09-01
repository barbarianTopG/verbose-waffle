import crypto from "crypto";

export default async function handler(req, res) {
  // Get target URL from query parameter
  const targetUrl = req.query.url;
  console.log("Incoming URL:", targetUrl);

  if (!targetUrl) {
    res.status(400).send("Missing URL parameter");
    return;
  }

  // AES-128-CBC values
  const keyHex = "f655ba9d09a112d4968c63579db590b4";
  const ivHex  = "98344c2eee86c3994890592585b49f80";
  const cipherHex = "30a3c4df5fe6ae726f456b3b14437511";

  const key = Buffer.from(keyHex, "hex");
  const iv  = Buffer.from(ivHex, "hex");
  const cipher = Buffer.from(cipherHex, "hex");

  // Decrypt AES-CBC — raw error if it fails
 const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
decipher.setAutoPadding(false); 
const decrypted = Buffer.concat([decipher.update(cipher), decipher.final()]);

  const cookie = decrypted.toString("hex");
  console.log("Decrypted cookie:", cookie);

  // Fetch the target page — raw error if it fails
  const fetchRes = await fetch(targetUrl, {
    headers: {
      "Cookie": `__test=${cookie}`,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
  });

  const body = await fetchRes.text();
  res.status(200).send(body);
}
