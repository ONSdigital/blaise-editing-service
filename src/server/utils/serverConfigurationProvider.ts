import { CaseOutcome, Organisation } from "blaise-api-node-client";

import {
  fixUrl,
  getStringOrThrowError,
  getSurveyConfigForRole,
  getSurveysForRole,
} from "../helpers/configurationHelper.js";

import type { RoleConfiguration, SurveyCaseConfiguration } from "../roleConfiguration.js";
import type { ServerConfiguration } from "../serverConfiguration.js";
import type { AuthConfig } from "blaise-login-react-server";

const ALLOWED_ROLES = ["SVT Supervisor", "SVT Editor", "FRS Researcher", "Survey Support"];

export interface ConfigurationProvider extends ServerConfiguration, AuthConfig {
  SessionSecret: string;
  SessionTimeout: string;
  Roles: string[];
  TokenIssuer: string;
  getSurveysForRole(userRole: string): string[];
  getSurveyConfigForRole(surveyTla: string, userRole: string): SurveyCaseConfiguration;
}

export default class ServerConfigurationProvider implements ConfigurationProvider {
  BlaiseApiUrl: string;

  DefaultPort: number = 5000;

  BuildFolder: string;

  Port: number;

  ServerPark: string;

  ExternalWebUrl: string;

  ProjectId: string;

  UrlDomain: string;

  SessionSecret: string;

  SessionTimeout: string;

  Roles: string[];

  DefaultSessionTimeout: string = "12h";

  RoleConfiguration: RoleConfiguration[];

  get TokenIssuer(): string {
    return this.ProjectId;
  }

  constructor() {
    const { BLAISE_API_URL, PROJECT_ID, PORT, SERVER_PARK, CATI_URL, URL_DOMAIN, SESSION_SECRET } =
      process.env;

    this.BuildFolder = "../client";

    this.BlaiseApiUrl = fixUrl(getStringOrThrowError(BLAISE_API_URL, "BLAISE_API_URL"));

    this.Port = this.parsePort(PORT);

    this.ServerPark = getStringOrThrowError(SERVER_PARK, "SERVER_PARK");

    this.ExternalWebUrl = getStringOrThrowError(CATI_URL, "CATI_URL");

    this.ProjectId = getStringOrThrowError(PROJECT_ID, "PROJECT_ID");

    this.UrlDomain = getStringOrThrowError(URL_DOMAIN, "URL_DOMAIN");

    this.SessionSecret = getStringOrThrowError(SESSION_SECRET, "SESSION_SECRET");

    this.SessionTimeout = this.DefaultSessionTimeout;

    this.RoleConfiguration = [
      {
        Role: "SVT Supervisor",
        Surveys: [
          {
            Survey: "FRS",
            Organisations: [Organisation.ONS],
            Outcomes: [
              CaseOutcome.Completed,
              CaseOutcome.CompletedNudge,
              CaseOutcome.CompletedProxy,
            ],
          },
        ],
      },
      {
        Role: "SVT Editor",
        Surveys: [
          {
            Survey: "FRS",
            Organisations: [Organisation.ONS],
            Outcomes: [
              CaseOutcome.Completed,
              CaseOutcome.CompletedNudge,
              CaseOutcome.CompletedProxy,
            ],
          },
        ],
      },
      {
        Role: "FRS Researcher",
        Surveys: [
          {
            Survey: "FRS",
            Organisations: [],
            Outcomes: [],
          },
        ],
      },
      {
        Role: "Survey Support",
        Surveys: [
          {
            Survey: "FRS",
            Organisations: [],
            Outcomes: [],
          },
        ],
      },
    ];

    this.Roles = ALLOWED_ROLES;
  }

  getSurveysForRole(userRole: string): string[] {
    return getSurveysForRole(this.RoleConfiguration, userRole);
  }

  getSurveyConfigForRole(surveyTla: string, userRole: string): SurveyCaseConfiguration {
    return getSurveyConfigForRole(this.RoleConfiguration, surveyTla, userRole);
  }

  private parsePort(port: string | undefined): number {
    if (port === undefined || port.trim() === "") {
      return this.DefaultPort;
    }

    const parsedPort = Number(port);

    if (!Number.isInteger(parsedPort) || parsedPort <= 0) {
      throw new TypeError("PORT is not set to a valid number");
    }

    return parsedPort;
  }
}
