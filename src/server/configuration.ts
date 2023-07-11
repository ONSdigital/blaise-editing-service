import { IConfiguration } from './interfaces/configuration.interface';

export default class Configuration implements IConfiguration {
  BlaiseApiUrl: string;

  BuildFolder: string;

  Port: number;

  ServerPark: string;

  ExternalWebUrl: string;
  // VM_EXTERNAL_WEB_URL

  constructor() {
    const {
      BLAISE_API_URL,
      PORT,
      SERVER_PARK,
      VM_EXTERNAL_WEB_URL,
    } = process.env;

    if (BLAISE_API_URL === undefined) {
      throw new ReferenceError('BLAISE_API_URL was not found in environment variables');
    }

    if (BLAISE_API_URL.trim() === '') {
      throw new Error('BLAISE_API_URL is set to an empty string');
    }

    if (PORT === undefined) {
      throw new ReferenceError('PORT was not found in environment variables');
    }

    if (Number.isNaN(+PORT) || +PORT === 0) {
      throw new TypeError('PORT is not set to a valid number');
    }

    if (SERVER_PARK === undefined) {
      throw new ReferenceError('SERVER_PARK was not found in environment variables');
    }

    if (SERVER_PARK.trim() === '') {
      throw new Error('SERVER_PARK is set to an empty string');
    }

    if (VM_EXTERNAL_WEB_URL === undefined) {
      throw new ReferenceError('VM_EXTERNAL_WEB_URL was not found in environment variables');
    }

    if (VM_EXTERNAL_WEB_URL.trim() === '') {
      throw new Error('VM_EXTERNAL_WEB_URL is set to an empty string');
    }

    this.BlaiseApiUrl = BLAISE_API_URL;
    this.BuildFolder = '../build';
    this.Port = +PORT;
    this.ServerPark = SERVER_PARK;
    this.ExternalWebUrl = VM_EXTERNAL_WEB_URL;
  }
}
