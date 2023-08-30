import dotenv from 'dotenv';
import BlaiseApiClient from 'blaise-api-node-client';
import nodeServer from './server';
import ConfigurationProvider from './configuration/ConfigurationProvider';

// create/get configuration
dotenv.config();
const config = new ConfigurationProvider();

// create client
const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);

// create server
const server = nodeServer(config, blaiseApiClient);

// run server
server.listen(config.Port, () => {
  /* eslint-disable no-console, no-control-regex */
  console.log(`Example app listening on port ${config.Port}`);
});
