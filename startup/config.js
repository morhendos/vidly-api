const config = require("config");

module.exports = function() {
  // Check if jwtPriavateKey is set, if not terminate a process
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
  }
};
