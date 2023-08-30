import { AuthConfig } from 'blaise-login-react-server';
import { Configuration } from '../interfaces/configurationInterface';
import {
  getStringOrThrowError, getNumberOrThrowError, sessionSecret, getStringOrSetDefault, loadRoles,
} from './configurationHelper';

export default class ConfigurationProvider implements Configuration, AuthConfig {
  BlaiseApiUrl: string;

  BuildFolder: string;

  Port: number;

  ServerPark: string;

  ExternalWebUrl: string;

  SessionSecret: string;

  SessionTimeout: string;

  Roles: string[];

  constructor() {
    const {
      BLAISE_API_URL,
      PORT,
      SERVER_PARK,
      VM_EXTERNAL_WEB_URL,
      SESSION_SECRET,
      SESSION_TIMEOUT,
      ROLES,
    } = process.env;

    this.BuildFolder = '../../build';

    this.BlaiseApiUrl = getStringOrThrowError(BLAISE_API_URL, 'BLAISE_API_URL');

    this.Port = getNumberOrThrowError(PORT, 'PORT');

    this.ServerPark = getStringOrThrowError(SERVER_PARK, 'SERVER_PARK');

    this.ExternalWebUrl = getStringOrThrowError(VM_EXTERNAL_WEB_URL, 'VM_EXTERNAL_WEB_URL');

    this.SessionSecret = sessionSecret(SESSION_SECRET);

    this.SessionTimeout = getStringOrSetDefault(SESSION_TIMEOUT, '12h');

    this.Roles = loadRoles(ROLES);
  }
}
