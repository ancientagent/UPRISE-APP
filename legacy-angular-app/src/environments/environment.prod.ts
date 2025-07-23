// import { config } from "./config";

import config from "../../config.json";
export const environment = {
  production: true,
  API_URL: config.API_URL,
  CLIENT_ID: config.CLIENT_ID,
  CLIENT_SECRET: config.CLIENT_SECRET,
  GOOGLE_API_KEY: config.GOOGLE_API_KEY,
};
