import React, { useState } from "react";
import { createLogger } from "../logging-middleware";

const TOKEN = "YOUR_ACCESS_TOKEN_HERE"; // Add token from .env or config
const log = createLogger({ stack: "frontend", token: TOKEN });

const MAX_URLS = 5;

const UrlShortener = () => {
  const [urls, setUrls] = useState([{ url: "", shortUrl: "" }]);

  const handleChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index].url = value;
    setUrls(newUrls);
  };

  const handleAdd = async () => {
    if (urls.length >= MAX_URLS) {
      await log("warn", "component", `Maximum of ${MAX_URLS} URLs reached`);
      return;
    }
    setUrls([...urls, { url: "", shortUrl: "" }]);
    await log("info", "component", `Added new URL input, total now ${urls.length + 1}`);
  };

  const handleShorten = async () => {
    for (let i = 0; i < urls.length; i++) {
      const { url } = urls[i];
      if (!url) {
        await log("warn", "component", `User tried to shorten empty URL at index ${i}`);
        continue;
      }

      try {
        const res = await fetch("http://localhost:8080/shorturls", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        const data = await res.json();

        if (res.ok) {
          const newUrls = [...urls];
          newUrls[i].shortUrl = data.shortLink;
          setUrls(newUrls);
          await log("info", "component", `Short URL created: ${data.shortLink}`);
        } else {
          await log("error", "component", `Failed to create short URL: ${data.error}`);
        }
      } catch (err) {
        await log("fatal", "component", `Unexpected error: ${err.message}`);
      }
    }
  };

  const handleRemove = async (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
    await log("info", "component", `Removed URL input at index ${index}`);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>URL Shortener</h2>
      {urls.map((item, index) => (
        <div key={index} style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Enter URL"
            value={item.url}
            onChange={(e) => handleChange(index, e.target.value)}
            style={styles.input}
          />
          {item.shortUrl && (
            <span style={styles.shortUrl}>
              Short URL: <a href={item.shortUrl}>{item.shortUrl}</a>
            </span>
          )}
          {urls.length > 1 && (
            <button
              style={{ ...styles.button, ...styles.removeButton }}
              onClick={() => handleRemove(index)}
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <div style={styles.buttonContainer}>
        {urls.length < MAX_URLS && (
          <button style={styles.button} onClick={handleAdd}>
            Add URL
          </button>
        )}
        <button style={{ ...styles.button, marginLeft: "10px" }} onClick={handleShorten}>
          Shorten URLs
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    color: "#2e7d32",
    marginBottom: "20px",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginRight: "10px",
    minWidth: "250px",
  },
  shortUrl: {
    marginLeft: "10px",
    fontSize: "0.9em",
    color: "#555",
  },
  buttonContainer: {
    textAlign: "center",
    marginTop: "20px",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#2e7d32",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  removeButton: {
    backgroundColor: "#c62828",
    marginLeft: "10px",
  },
};

export default UrlShortener;
