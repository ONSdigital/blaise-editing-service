import dotenv from "dotenv";

import nodeServer from "./server.js";
import ServerConfigurationProvider from "./utils/serverConfigurationProvider.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const config = new ServerConfigurationProvider();

const server = nodeServer(config);

server
  .listen(config.Port, () => {
    console.log(`Blaise Editing Service running on port ${config.Port}`);
  })
  .on("error", (error: Error) => {
    console.error(error, "Failed to start server");
    process.exit(1);
  });
