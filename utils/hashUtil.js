const crypto = require("crypto");

const generateHash = (event) => {
  const eventString = JSON.stringify(event);
  return crypto.createHash("sha256").update(eventString).digest("hex");
};

module.exports = { generateHash };
