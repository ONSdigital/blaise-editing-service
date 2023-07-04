import dotenv from "dotenv";
import getConfigFromEnv from "./config";
import { nodeServer } from "./server";

dotenv.config();
const config = getConfigFromEnv();
const server = nodeServer(config);

server.listen(config.Port, () => {
    console.log(`Example app listening on port ${config.Port}`);
  });