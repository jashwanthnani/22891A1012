const axios = require("axios");

const LOGS_URL = "http://20.244.56.144/evaluation-service/logs";

async function Log(stack, level, pkg, message, token) {
  try {
    const res = await axios.post(
      LOGS_URL,
      { stack, level, package: pkg, message },
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );
    return res.data;
  } catch (err) {
    console.error("Log failed:", err?.response?.data || err.message);
  }
}

function createLogger({ stack, token }) {
  return (level, pkg, message) => Log(stack, level, pkg, message, token);
}

module.exports = { Log, createLogger };
