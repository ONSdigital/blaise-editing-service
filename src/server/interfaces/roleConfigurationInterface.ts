import { CaseOutcome } from 'blaise-api-node-client';
import Organisation from 'blaise-api-node-client/lib/cjs/enums/organisation';

export interface RoleConfiguration {
  Role: string;
  Surveys: SurveyCaseConfiguration[]
}

export interface SurveyCaseConfiguration {
  Survey: string
  Organisations: Organisation[];
  Outcomes: CaseOutcome[]
}
