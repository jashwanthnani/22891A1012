import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";

const Shortener = () => {
  const [urls, setUrls] = useState([{ url: "", validity: 30, shortcode: "" }]);
  const [results, setResults] = useState([]);

  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const handleAddRow = () => {
    if (urls.length < 5) setUrls([...urls, { url: "", validity: 30, shortcode: "" }]);
  };

  const handleSubmit = async () => {
    const resArr = [];
    for (let u of urls) {
      if (!u.url) continue;
      try {
        const res = await fetch("http://localhost:8080/shorturls", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(u),
        });
        const data = await res.json();
        resArr.push(data);
      } catch (err) {
        console.error(err);
      }
    }
    setResults(resArr);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4">URL Shortener</Typography>
      {urls.map((u, i) => (
        <Box key={i} sx={{ display: "flex", gap: 1, mt: 1 }}>
          <TextField
            label="URL"
            value={u.url}
            onChange={(e) => handleChange(i, "url", e.target.value)}
            fullWidth
          />
          <TextField
            label="Validity (minutes)"
            type="number"
            value={u.validity}
            onChange={(e) => handleChange(i, "validity", e.target.value)}
            sx={{ width: 150 }}
          />
          <TextField
            label="Shortcode (optional)"
            value={u.shortcode}
            onChange={(e) => handleChange(i, "shortcode", e.target.value)}
            sx={{ width: 150 }}
          />
        </Box>
      ))}
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddRow}>
        Add URL
      </Button>
      <Button variant="contained" sx={{ mt: 2, ml: 2 }} onClick={handleSubmit}>
        Shorten
      </Button>

      {results.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Results:</Typography>
          {results.map((r, i) => (
            <Box key={i} sx={{ mt: 1 }}>
              <a href={r.shortLink} target="_blank" rel="noreferrer">{r.shortLink}</a> - Expiry: {r.expiry}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Shortener;
