import { IConfiguration } from '../interfaces/configuration.interface';

export default class FakeConfiguration implements IConfiguration {
  BlaiseApiUrl: string;

  BuildFolder: string;

  Port: number;

  ServerPark: string;

  ExternalWebUrl: string;

  constructor(
    blaiseApiUrl: string,
    buildFolder: string,
    port: number,
    serverPark: string,
    externalWebUrl: string,
  ) {
    this.BlaiseApiUrl = blaiseApiUrl;
    this.BuildFolder = buildFolder;
    this.Port = port;
    this.ServerPark = serverPark;
    this.ExternalWebUrl = externalWebUrl;
  }
}
