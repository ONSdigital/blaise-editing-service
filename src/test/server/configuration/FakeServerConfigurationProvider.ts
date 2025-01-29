import { CaseOutcome } from 'blaise-api-node-client';
import Organisation from 'blaise-api-node-client/lib/cjs/enums/organisation';
import ServerConfigurationProvider from '../../../server/configuration/ServerConfigurationProvider';
import { RoleConfiguration } from '../../../server/interfaces/roleConfigurationInterface';
import { getSurveyConfigForRole, getSurveysForRole } from '../../../server/helpers/configurationHelper';

export default class FakeServerConfigurationProvider implements ServerConfigurationProvider {
  BlaiseApiUrl: string;

  BuildFolder: string;

  Port: number;

  ServerPark: string;

  ExternalWebUrl: string;

  SessionSecret: string;

  SessionTimeout: string;

  Roles: string[];

  DefaultSessionTimeout: string = '12h';

  DefaultRoles: string[] = ['SVT Supervisor', 'SVT Editor'];

  RoleConfiguration: RoleConfiguration[];

  constructor(
    blaiseApiUrl?: string,
    buildFolder?: string,
    port?: number,
    serverPark?: string,
    externalWebUrl?: string,
    sessionSecret?: string,
    sessionTimeout?: string,
    roles?: string[],
    roleConfiguration?: RoleConfiguration[],
  ) {
    this.BlaiseApiUrl = blaiseApiUrl ?? 'restapi.blaise.com';
    this.BuildFolder = buildFolder ?? 'dist';
    this.Port = port ?? 5000;
    this.ServerPark = serverPark ?? 'gusty';
    this.ExternalWebUrl = externalWebUrl ?? 'cati.blaise.com';
    this.SessionSecret = sessionSecret ?? 'richlikesricecakes';
    this.SessionTimeout = sessionTimeout ?? this.DefaultSessionTimeout;
    this.Roles = roles ?? this.DefaultRoles;
    this.RoleConfiguration = roleConfiguration ?? [{
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
        Survey: 'TEST',
        Organisations: [Organisation.ONS],
        Outcomes: [],
      },
      {
        Survey: 'FRS',
        Organisations: [Organisation.ONS],
        Outcomes: [CaseOutcome.Completed, CaseOutcome.CompletedNudge, CaseOutcome.CompletedProxy],
      }],
    },
    {
      Role: 'FRS Research',
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
    {
      Role: 'SVT NotConfigured',
      Surveys: [{
        Survey: 'LMS',
        Organisations: [Organisation.ONS],
        Outcomes: [CaseOutcome.Completed, CaseOutcome.CompletedNudge, CaseOutcome.CompletedProxy],
      }],
    },
    {
      Role: 'SVT AllOutcomes',
      Surveys: [{
        Survey: 'FRS',
        Organisations: [Organisation.ONS],
        Outcomes: [],
      }],
    }];
  }

  getSurveysForRole(userRole: string) {
    return getSurveysForRole(this.RoleConfiguration, userRole);
  }

  getSurveyConfigForRole(surveyTla: string, userRole: string) {
    return getSurveyConfigForRole(this.RoleConfiguration, surveyTla, userRole);
  }
}
