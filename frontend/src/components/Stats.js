import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";

const Stats = () => {
  const [shortcode, setShortcode] = useState("");
  const [stats, setStats] = useState(null);

  const handleSubmit = async () => {
    if (!shortcode) return;
    try {
      const res = await fetch(`http://localhost:8080/shorturls/${shortcode}`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4">Short URL Stats</Typography>
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        <TextField
          label="Shortcode"
          value={shortcode}
          onChange={(e) => setShortcode(e.target.value)}
        />
        <Button variant="contained" onClick={handleSubmit}>Get Stats</Button>
      </Box>

      {stats && (
        <Box sx={{ mt: 2 }}>
          <Typography>Original URL: {stats.originalUrl}</Typography>
          <Typography>Created At: {stats.createdAt}</Typography>
          <Typography>Expiry: {stats.expiry}</Typography>
          <Typography>Total Clicks: {stats.clicks?.length || 0}</Typography>
          {stats.clicks && stats.clicks.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography>Click Details:</Typography>
              {stats.clicks.map((c, i) => (
                <Typography key={i}>
                  {c.timestamp} | {c.referrer} | {c.location}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Stats;
