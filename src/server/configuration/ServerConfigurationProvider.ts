import { AuthConfig } from 'blaise-login-react-server';
import { CaseOutcome } from 'blaise-api-node-client';
import Organisation from 'blaise-api-node-client/lib/cjs/enums/organisation';
import { ServerConfiguration } from '../interfaces/serverConfigurationInterface';
import {
  fixUrl, generateSessionSecret,
  getNumberOrThrowError, getStringOrSetDefault, getStringOrThrowError, GetListOrSetDefault,
  getRoles,
  getSurveyConfigForRole,
  getSurveysForRole,
} from '../helpers/configurationHelper';
import { RoleConfiguration } from '../interfaces/roleConfigurationInterface';

export default class ServerConfigurationProvider implements ServerConfiguration, AuthConfig {
  BlaiseApiUrl: string;

  BuildFolder: string;

  Port: number;

  ServerPark: string;

  ExternalWebUrl: string;

  SessionSecret: string;

  SessionTimeout: string;

  Roles: string[];

  DefaultSessionTimeout: string = '12h';

  RoleConfiguration: RoleConfiguration[];

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

    this.BuildFolder = '../../dist';

    this.BlaiseApiUrl = fixUrl(getStringOrThrowError(BLAISE_API_URL, 'BLAISE_API_URL'));

    this.Port = getNumberOrThrowError(PORT, 'PORT');

    this.ServerPark = getStringOrThrowError(SERVER_PARK, 'SERVER_PARK');

    this.ExternalWebUrl = getStringOrThrowError(VM_EXTERNAL_WEB_URL, 'VM_EXTERNAL_WEB_URL');

    this.SessionSecret = generateSessionSecret(SESSION_SECRET);

    this.SessionTimeout = getStringOrSetDefault(SESSION_TIMEOUT, this.DefaultSessionTimeout);

    this.RoleConfiguration = [{
      Role: 'SVT Supervisor',
      Surveys: [{
        Survey: 'FRS',
        Organisations: [Organisation.ONS],
        Outcomes: [CaseOutcome.Completed, CaseOutcome.CompletedNudge, CaseOutcome.CompletedProxy],
      }],
    },
    {
      Role: 'SVT Editor',
      Surveys: [{
        Survey: 'FRS',
        Organisations: [Organisation.ONS],
        Outcomes: [CaseOutcome.Completed, CaseOutcome.CompletedNudge, CaseOutcome.CompletedProxy],
      },
      ],
    },
    {
      Role: 'FRS Researcherer',
      Surveys: [{
        Survey: 'FRS',
        Organisations: [],
        Outcomes: [],
      },
      ],
    },
    {
      Role: 'Survey Support',
      Surveys: [{
        Survey: 'FRS',
        Organisations: [],
        Outcomes: [],
      },
      ],
    },
    ];

    this.Roles = GetListOrSetDefault(ROLES, getRoles(this.RoleConfiguration));
  }

  getSurveysForRole(userRole: string) {
    return getSurveysForRole(this.RoleConfiguration, userRole);
  }

  getSurveyConfigForRole(surveyTla: string, userRole: string) {
    return getSurveyConfigForRole(this.RoleConfiguration, surveyTla, userRole);
  }
}
