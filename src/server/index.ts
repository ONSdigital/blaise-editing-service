import dotenv from 'dotenv';
import BlaiseApiClient from 'blaise-api-node-client';
import nodeServer from './server';
import ServerConfigurationProvider from './configuration/ServerConfigurationProvider';
import BlaiseApi from './api/BlaiseApi';
import GoogleCloudLogger from './logger/googleCloudLogger';
import createLogger from './logger/pinoLogger';

// create/get configuration
dotenv.config(); // TODO: only needed for running locally
const config = new ServerConfigurationProvider();

// create client
const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);

// create logger
const pinoLogger = createLogger();
const cloudLogger = new GoogleCloudLogger(pinoLogger, config.ProjectId);

// create Blaise API
const blaiseApi = new BlaiseApi(config, blaiseApiClient, cloudLogger);

// create server
const server = nodeServer(config, blaiseApi);

// run server
server.listen(config.Port, () => {
  /* eslint-disable no-console, no-control-regex */
  console.log(`Example app listening on port ${config.Port}`);
});
