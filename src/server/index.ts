import dotenv from 'dotenv';
import nodeServer from './server';
import ServerConfigurationProvider from './configuration/ServerConfigurationProvider';
import BlaiseApi from './api/BlaiseApi';

// create/get configuration
dotenv.config(); // TODO: only needed for running locally
const config = new ServerConfigurationProvider();





// create server
const server = nodeServer(config);

// run server
server.listen(config.Port, () => {
  cloudLogger.info(`Blaise Editing Service running on port ${config.Port}`);
});
