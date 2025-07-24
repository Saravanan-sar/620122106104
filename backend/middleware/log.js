// log.js
const axios = require("axios");

const log = async (stack, level, pkg, message) => {
  try {
    const response = await axios.post("http://localhost:5000/log"{
      stack,
      level,
      package: pkg,
      message,
    });

    console.log(` Log sent [${level}]: ${message}`);
  } catch (error) {
    console.error(" Logging failed:", error.message);
  }
};

module.exports = log;
