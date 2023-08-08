import { ConfigurationInterface } from '../interfaces/configuration.interface';
import { getStringOrThrowError, getNumberOrThrowError } from './configuration.helper';

export default class Configuration implements ConfigurationInterface {
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
