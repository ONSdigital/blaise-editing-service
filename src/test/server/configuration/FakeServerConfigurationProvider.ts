import ServerConfigurationProvider from '../../../server/configuration/ServerConfigurationProvider';

export default class FakeServerConfigurationProvider implements ServerConfigurationProvider {
  BlaiseApiUrl: string;

  BuildFolder: string;

  Port: number;

  ServerPark: string;

  ExternalWebUrl: string;

  SessionSecret: string;

  SessionTimeout: string;

  Roles: string[];

  constructor(
    blaiseApiUrl?: string,
    buildFolder?: string,
    port?: number,
    serverPark?: string,
    externalWebUrl?: string,
    sessionSecret?: string,
    sessionTimeout?: string,
    roles?: string[],
  ) {
    this.BlaiseApiUrl = blaiseApiUrl ?? 'restapi.blaise.com';
    this.BuildFolder = buildFolder ?? 'dist';
    this.Port = port ?? 5000;
    this.ServerPark = serverPark ?? 'gusty';
    this.ExternalWebUrl = externalWebUrl ?? 'cati.blaise.com';
    this.SessionSecret = sessionSecret ?? 'richlikesricecakes';
    this.SessionTimeout = sessionTimeout ?? '12h';
    this.Roles = roles ?? ['DST'];
  }
}
