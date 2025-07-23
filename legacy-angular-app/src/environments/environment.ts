// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// import { config } from "./config";

// config dotenv
import config from "../../config.json";
export const environment = {
  production: false,
  API_URL: config.API_URL,
  CLIENT_ID: config.CLIENT_ID,
  CLIENT_SECRET: config.CLIENT_SECRET,
  GOOGLE_API_KEY: config.GOOGLE_API_KEY,
};
