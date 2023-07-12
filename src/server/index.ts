import dotenv from 'dotenv';
import BlaiseApiClient from 'blaise-api-node-client';
import nodeServer from './server';
import Configuration from './configuration/configuration';

// create/get configuration
dotenv.config();
const config = new Configuration();

// create client
const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);

// create server
const server = nodeServer(config, blaiseApiClient);

// run server
server.listen(config.Port, () => {
  console.log(`Example app listening on port ${config.Port}`);
});
