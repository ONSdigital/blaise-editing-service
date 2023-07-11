import { IConfiguration } from './interfaces/configuration.interface';

export default class Configuration implements IConfiguration {
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

    this.BlaiseApiUrl = Configuration.getStringFromVariable(BLAISE_API_URL, 'BLAISE_API_URL');
    this.BuildFolder = '../build';
    this.Port = Configuration.getNumberFromVariable(PORT, 'PORT');
    this.ServerPark = Configuration.getStringFromVariable(SERVER_PARK, 'SERVER_PARK');
    this.ExternalWebUrl = Configuration.getStringFromVariable(VM_EXTERNAL_WEB_URL, 'VM_EXTERNAL_WEB_URL');
  }

  static getStringFromVariable(environmentVariable: string | undefined, variableName: string) {
    if (environmentVariable === undefined || environmentVariable.trim() === '') {
      throw ReferenceError(`${variableName} has not been set or is set to an empty string`);
    }
    return environmentVariable;
  }

  static getNumberFromVariable(environmentVariable: string | undefined, variableName: string) {
    const value = Configuration.getStringFromVariable(environmentVariable, variableName);

    if (Number.isNaN(+value)) {
      throw new TypeError(`${variableName} is not set to a valid number`);
    }
    return +value;
  }
}
