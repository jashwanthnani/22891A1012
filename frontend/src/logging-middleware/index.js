import axios from "axios";

export const createLogger = ({ stack = "frontend", token }) => {
  /**
   * Log function
   * @param {string} level - debug | info | warn | error | fatal
   * @param {string} packageName - api | component | hook | page | state | style | auth | config | middleware | utils
   * @param {string} message - descriptive message
   */
  return async (level, packageName, message) => {
    try {
      await axios.post(
        "http://20.244.56.144/evaluation-service/logs",
        {
          stack,
          level,
          package: packageName,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Logging failed:", err.message);
    }
  };
};
