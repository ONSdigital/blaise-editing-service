import dotenv from 'dotenv';
import nodeServer from './server';
import ServerConfigurationProvider from './ServerConfigurationProvider';

// create/get configuration
dotenv.config(); // TODO: only needed for running locally
const config = new ServerConfigurationProvider();


// create server
const server = nodeServer(config);

// run server
server.listen(config.Port, () => {
  console.log(`Blaise Editing Service running on port ${config.Port}`);
});
