// load dot env and make json file from it
require("dotenv").config();
const fs = require("fs");

fs.open("./config.json", "w", (err, fd) => {
  if (err) {
    throw "error opening file: " + err;
  }
  const config = {
    API_URL: process.env.API_URL,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  };
  fs.writeFile("./config.json", JSON.stringify(config, null, 1), (err) => {
    if (err) {
      throw "error writing file: " + err;
    }
    console.log("successfully wrote config file");
  });
});
