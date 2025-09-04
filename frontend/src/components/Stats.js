import React, { useState } from "react";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";
import { createLogger } from "../logging-middleware";

const TOKEN = "YOUR_ACCESS_TOKEN_HERE"; // Add token from .env/config
const log = createLogger({ stack: "frontend", token: TOKEN });

const Stats = () => {
  const [shortcode, setShortcode] = useState("");
  const [stats, setStats] = useState(null);

  const handleSubmit = async () => {
    if (!shortcode) {
      await log("warn", "component", "User tried to fetch stats without shortcode");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/shorturls/${shortcode}`);
      const data = await res.json();
      if (res.ok) {
        setStats(data);
        await log("info", "component", `Fetched stats for shortcode: ${shortcode}`);
      } else {
        await log("error", "component", `Failed to fetch stats: ${data.error}`);
        setStats(null);
      }
    } catch (err) {
      await log("fatal", "component", `Unexpected error fetching stats: ${err.message}`);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "40px auto", p: 3 }}>
      <Typography variant="h4" sx={{ color: "#2e7d32", mb: 2, textAlign: "center" }}>
        Short URL Stats
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          label="Shortcode"
          variant="outlined"
          fullWidth
          value={shortcode}
          onChange={(e) => setShortcode(e.target.value)}
        />
        <Button variant="contained" sx={{ backgroundColor: "#2e7d32" }} onClick={handleSubmit}>
          Get Stats
        </Button>
      </Box>

      {stats && (
        <Paper sx={{ p: 2, mt: 2, backgroundColor: "#f9f9f9" }} elevation={3}>
          <Typography><strong>Original URL:</strong> {stats.url}</Typography>
          <Typography><strong>Short Link:</strong> <a href={stats.shortLink}>{stats.shortLink}</a></Typography>
          <Typography><strong>Created At:</strong> {new Date(stats.createdAt).toLocaleString()}</Typography>
          <Typography><strong>Expiry:</strong> {new Date(stats.expiry).toLocaleString()}</Typography>
          <Typography><strong>Total Clicks:</strong> {stats.totalClicks}</Typography>

          {stats.clicks && stats.clicks.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle1"><strong>Click Details:</strong></Typography>
              {stats.clicks.map((c, i) => (
                <Typography key={i} sx={{ fontSize: "0.9em" }}>
                  {new Date(c.timestamp).toLocaleString()} | Referrer: {c.referrer} | Location: {c.location}
                </Typography>
              ))}
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default Stats;
