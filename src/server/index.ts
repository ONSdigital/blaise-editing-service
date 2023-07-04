import dotenv from 'dotenv';
import BlaiseApiClient from 'blaise-api-node-client';
import getConfigFromEnv from './config';
import nodeServer from './server';

// create/get configuration
dotenv.config();
const config = getConfigFromEnv();

// create client
const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);

// create server
const server = nodeServer(config, blaiseApiClient);

// run server
server.listen(config.Port, () => {
  console.log(`Example app listening on port ${config.Port}`);
});
