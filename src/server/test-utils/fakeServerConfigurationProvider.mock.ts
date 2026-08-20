import { CaseOutcome, Organisation } from "blaise-api-node-client";

import { getSurveyConfigForRole, getSurveysForRole } from "../helpers/configurationHelper.js";

import type { RoleConfiguration } from "../roleConfiguration.js";
import type { ConfigurationProvider } from "../utils/serverConfigurationProvider.js";

export default class FakeServerConfigurationProvider implements ConfigurationProvider {
  BlaiseApiUrl: string;

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

  DefaultRoles: string[] = ["SVT Supervisor", "SVT Editor"];

  RoleConfiguration: RoleConfiguration[];

  get TokenIssuer(): string {
    return this.ProjectId;
  }

  constructor(
    blaiseApiUrl?: string,
    buildFolder?: string,
    port?: number,
    serverPark?: string,
    externalWebUrl?: string,
    projectId?: string,
    urlDomain?: string,
    sessionSecret?: string,
    sessionTimeout?: string,
    roles?: string[],
    roleConfiguration?: RoleConfiguration[],
  ) {
    this.BlaiseApiUrl = blaiseApiUrl ?? "http://restapi.blaise.com";
    this.BuildFolder = buildFolder ?? "../client";
    this.Port = port ?? 5000;
    this.ServerPark = serverPark ?? "gusty";
    this.ExternalWebUrl = externalWebUrl ?? "cati.blaise.com";
    this.ProjectId = projectId ?? "ons-blaise-v2-dev";
    this.UrlDomain = urlDomain ?? "localhost";
    this.SessionSecret = sessionSecret ?? "richlikesricecakes";
    this.SessionTimeout = sessionTimeout ?? this.DefaultSessionTimeout;
    this.Roles = roles ?? this.DefaultRoles;
    this.RoleConfiguration = roleConfiguration ?? [
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
            Survey: "TEST",
            Organisations: [Organisation.ONS],
            Outcomes: [],
          },
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
      {
        Role: "SVT NotConfigured",
        Surveys: [
          {
            Survey: "LMS",
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
        Role: "SVT AllOutcomes",
        Surveys: [
          {
            Survey: "FRS",
            Organisations: [Organisation.ONS],
            Outcomes: [],
          },
        ],
      },
    ];
  }

  getSurveysForRole(userRole: string) {
    return getSurveysForRole(this.RoleConfiguration, userRole);
  }

  getSurveyConfigForRole(surveyTla: string, userRole: string) {
    return getSurveyConfigForRole(this.RoleConfiguration, surveyTla, userRole);
  }
}
