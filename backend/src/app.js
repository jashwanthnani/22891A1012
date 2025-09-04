require("dotenv").config();
const express = require("express");
const cors = require("cors"); 
const { createLogger } = require("../../logging-middleware"); 
const validUrl = require("valid-url"); 
const shortid = require("shortid"); 

const app = express();

app.use(express.json());
app.use(cors()); 

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || `http://localhost:${PORT}`;
const TOKEN = process.env.LOG_TOKEN;

const log = createLogger({ stack: "backend", token: TOKEN });

const urlDB = {}; 

function generateShortCode() {
  let code;
  do {
    code = shortid.generate(); 
  } while (urlDB[code]);
  return code;
}

app.post("/shorturls", async (req, res) => {
  try {
    const { url, validity = 30, shortcode } = req.body;

    // Validate URL
    if (!url || !validUrl.isUri(url)) {
      await log("error", "handler", "Invalid URL provided");
      return res.status(400).json({ error: "Invalid URL" });
    }

    let code = shortcode || generateShortCode();
    if (urlDB[code]) {
      await log("warn", "handler", `Shortcode collision: ${code}`);
      return res.status(409).json({ error: "Shortcode already exists" });
    }

    const createdAt = new Date();
    const expiry = new Date(createdAt.getTime() + validity * 60000); // minutes → ms

    urlDB[code] = {
      originalUrl: url,
      createdAt,
      expiry,
      clicks: [],
    };

    await log("info", "handler", `Short URL created: ${code}`);

    res.status(201).json({
      shortLink: `${HOST}/${code}`,
      expiry: expiry.toISOString(),
    });
  } catch (err) {
    await log("fatal", "handler", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/:shortcode", async (req, res) => {
  try {
    const { shortcode } = req.params;
    const entry = urlDB[shortcode];

    if (!entry) {
      await log("warn", "handler", `Shortcode not found: ${shortcode}`);
      return res.status(404).json({ error: "Short URL not found" });
    }

    const now = new Date();
    if (entry.expiry < now) {
      await log("warn", "handler", `Shortcode expired: ${shortcode}`);
      return res.status(410).json({ error: "Short URL expired" });
    }

    const click = {
      timestamp: now.toISOString(),
      referrer: req.get("Referrer") || "direct",
      location: "Unknown", 
    };
    entry.clicks.push(click);
    await log("info", "handler", `Redirect: ${shortcode} clicked`);

    res.redirect(entry.originalUrl);
  } catch (err) {
    await log("fatal", "handler", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/shorturls/:shortcode", async (req, res) => {
  try {
    const { shortcode } = req.params;
    const entry = urlDB[shortcode];

    if (!entry) {
      await log("warn", "handler", `Stats requested for missing shortcode: ${shortcode}`);
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.json({
      url: entry.originalUrl,
      shortLink: `${HOST}/${shortcode}`,
      createdAt: entry.createdAt.toISOString(),
      expiry: entry.expiry.toISOString(),
      totalClicks: entry.clicks.length,
      clicks: entry.clicks,
    });
  } catch (err) {
    await log("fatal", "handler", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, async () => {
  await log("info", "route", `Backend started on port ${PORT}`);
  console.log(`🚀 Backend running at ${HOST}`);
});
