const fs = require("fs");

const logger = {
  log: msg => fs.appendFileSync("logs.txt", msg + "\n")
};

module.exports = logger;