import type { CaseOutcome } from "blaise-api-node-client";
import type { Organisation } from "blaise-api-node-client";

export interface RoleConfiguration {
  Role: string;
  Surveys: SurveyCaseConfiguration[];
}

export interface SurveyCaseConfiguration {
  Survey: string;
  Organisations: Organisation[];
  Outcomes: CaseOutcome[];
}
