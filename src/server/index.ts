import dotenv from 'dotenv';
import BlaiseApiClient from 'blaise-api-node-client';
import { LoggingWinston } from '@google-cloud/logging-winston';
import winston from 'winston';
import nodeServer from './server';
import ServerConfigurationProvider from './configuration/ServerConfigurationProvider';
import BlaiseApi from './api/BlaiseApi';
import GoogleCloudLogger from './logger/googleCloudLogger';

// create/get configuration
dotenv.config(); // TODO: only needed for running locally
const config = new ServerConfigurationProvider();

// create client
const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);

// create logger
const loggingWinston = new LoggingWinston();
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    loggingWinston,
  ],
});
const cloudLogger = new GoogleCloudLogger(logger);

// create Blaise API
const blaiseApi = new BlaiseApi(config, blaiseApiClient, cloudLogger);

// create server
const server = nodeServer(config, blaiseApi);

// run server
server.listen(config.Port, () => {
  cloudLogger.info(`Blaise Editing Service running on port ${config.Port}`);
});
