import { Configuration } from '../interfaces/configurationInterface';
import { getStringOrThrowError, getNumberOrThrowError } from './configurationHelper';

export default class ConfigurationProvider implements Configuration {
  BlaiseApiUrl: string;

  BuildFolder: string;

  Port: number;

  ServerPark: string;

  ExternalWebUrl: string;

  constructor() {
    const {
      BLAISE_API_URL,
      PORT,
      SERVER_PARK,
      VM_EXTERNAL_WEB_URL,
    } = process.env;

    this.BuildFolder = '../../build';

    this.BlaiseApiUrl = getStringOrThrowError(BLAISE_API_URL, 'BLAISE_API_URL');
    this.Port = getNumberOrThrowError(PORT, 'PORT');
    this.ServerPark = getStringOrThrowError(SERVER_PARK, 'SERVER_PARK');
    this.ExternalWebUrl = getStringOrThrowError(VM_EXTERNAL_WEB_URL, 'VM_EXTERNAL_WEB_URL');
  }
}
