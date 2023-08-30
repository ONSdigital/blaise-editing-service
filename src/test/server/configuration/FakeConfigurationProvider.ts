import ConfigurationProvider from '../../../server/configuration/ConfigurationProvider';

export default class FakeConfigurationProvider implements ConfigurationProvider {
  BlaiseApiUrl: string;

  BuildFolder: string;

  Port: number;

  ServerPark: string;

  ExternalWebUrl: string;

  SessionSecret: string;

  SessionTimeout: string;

  Roles: string[];

  constructor(
    blaiseApiUrl: string,
    buildFolder: string,
    port: number,
    serverPark: string,
    externalWebUrl: string,
    sessionSecret: string,
    sessionTimeout: string,
    roles: string[],
  ) {
    this.BlaiseApiUrl = blaiseApiUrl;
    this.BuildFolder = buildFolder;
    this.Port = port;
    this.ServerPark = serverPark;
    this.ExternalWebUrl = externalWebUrl;
    this.SessionSecret = sessionSecret;
    this.SessionTimeout = sessionTimeout;
    this.Roles = roles;
  }
}
