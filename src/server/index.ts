import dotenv from 'dotenv';
import BlaiseApiClient from 'blaise-api-node-client';
import nodeServer from './server';
import ConfigurationProvider from './configuration/ConfigurationProvider';
import BlaiseApi from './api/BlaiseApi';

// create/get configuration
dotenv.config();
const config = new ConfigurationProvider();

// create client
const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);

// create Blaise API
const blaiseApi = new BlaiseApi(config, blaiseApiClient);

// create server
const server = nodeServer(config, blaiseApi);

// run server
server.listen(config.Port, () => {
  /* eslint-disable no-console, no-control-regex */
  console.log(`Example app listening on port ${config.Port}`);
});
