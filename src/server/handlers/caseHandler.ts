import { type Auth } from "blaise-login-react-server";
import express from "express";
import moment from "moment";

import getRequestUserContext from "../helpers/getRequestUserContext.js";
import handleApiError from "../helpers/handleApiError.js";
import toCaseSummary from "../utils/caseMapper.js";
import { sanitiseForLogging } from "../utils/sanitisation.js";
import { validateQuestionnaireName } from "../utils/validation.js";

import type { CaseSummaryDetails } from "../../common/types/case.types.js";
import type { Controller } from "../controller.js";
import type AuditLogger from "../utils/auditLogger.js";
import type BlaiseApi from "../utils/blaiseApi.js";
import type { ConfigurationProvider } from "../utils/serverConfigurationProvider.js";
import type { CaseEditInformation } from "blaise-api-node-client";
import type { Request, Response } from "express";

const CASE_ALLOCATION_CONCURRENCY_LIMIT = 10;

export default class CaseHandler implements Controller {
  blaiseApi: BlaiseApi;
  configuration: ConfigurationProvider;
  auth: Auth;
  auditLogger: AuditLogger;

  constructor(
    blaiseApi: BlaiseApi,
    configuration: ConfigurationProvider,
    auth: Auth,
    auditLogger: AuditLogger,
  ) {
    this.blaiseApi = blaiseApi;
    this.configuration = configuration;
    this.getCaseEditInformation = this.getCaseEditInformation.bind(this);
    this.getCaseSummary = this.getCaseSummary.bind(this);
    this.allocateCases = this.allocateCases.bind(this);
    this.setCaseToUpdate = this.setCaseToUpdate.bind(this);
    this.auth = auth;
    this.auditLogger = auditLogger;
  }

  getRoutes() {
    const router = express.Router();

    router.get(
      "/api/questionnaires/:questionnaireName/cases/:caseId/summary",
      this.auth.middleware,
      this.getCaseSummary,
    );
    router.get(
      "/api/questionnaires/:questionnaireName/cases/edit",
      this.auth.middleware,
      this.getCaseEditInformation,
    );
    router.patch(
      "/api/questionnaires/:questionnaireName/cases/allocate",
      this.auth.middleware,
      this.allocateCases,
    );
    router.patch(
      "/api/questionnaires/:questionnaireName/cases/:caseId/update",
      this.auth.middleware,
      this.setCaseToUpdate,
    );

    return router;
  }

  async getCaseSummary(
    request: Request<{ questionnaireName: string; caseId: string }>,
    response: Response<CaseSummaryDetails>,
  ) {
    const { caseId } = request.params;
    const questionnaireNameRaw = request.params.questionnaireName;

    const { role: currentUserRole, username } = getRequestUserContext(request, this.auth);
    const sanitisedCaseId = sanitiseForLogging(caseId);
    const sanitisedQuestionnaireNameRaw = sanitiseForLogging(questionnaireNameRaw);
    const sanitisedUsername = sanitiseForLogging(username);
    const sanitisedCurrentUserRole = sanitiseForLogging(currentUserRole);

    try {
      const questionnaireName = validateQuestionnaireName(questionnaireNameRaw);
      const caseResponse = await this.blaiseApi.getCase(questionnaireName, caseId);
      const caseSummary = toCaseSummary(caseResponse);
      const sanitisedQuestionnaireName = sanitiseForLogging(questionnaireName);

      this.auditLogger.info(
        request.log,
        `Retrieved case: ${sanitisedCaseId}, questionnaire: ${sanitisedQuestionnaireName}, current user: {name: ${sanitisedUsername}, role: ${sanitisedCurrentUserRole}}`,
      );

      return response.status(200).json(caseSummary);
    } catch (error: unknown) {
      return handleApiError(
        error,
        response,
        this.auditLogger,
        request.log,
        `Failed to get case details, case: ${sanitisedCaseId}, questionnaire: ${sanitisedQuestionnaireNameRaw}, current user: {name: ${sanitisedUsername}, role: ${sanitisedCurrentUserRole}}`,
      );
    }
  }

  async getCaseEditInformation(
    request: Request<
      { questionnaireName: string },
      Record<string, never>,
      Record<string, never>,
      { userRole: string }
    >,
    response: Response<CaseEditInformation[]>,
  ) {
    const questionnaireNameRaw = request.params.questionnaireName;
    const { userRole: requestedUserRole } = request.query;

    const { role: currentUserRole, username } = getRequestUserContext(request, this.auth);
    const sanitisedQuestionnaireNameRaw = sanitiseForLogging(questionnaireNameRaw);
    const sanitisedUsername = sanitiseForLogging(username);
    const sanitisedCurrentUserRole = sanitiseForLogging(currentUserRole);

    try {
      const questionnaireName = validateQuestionnaireName(questionnaireNameRaw);
      const caseEditInformationList = await this.getCaseEditInformationForRole(
        questionnaireName,
        requestedUserRole,
        username,
        currentUserRole,
        request,
      );

      return response.status(200).json(caseEditInformationList);
    } catch (error: unknown) {
      return handleApiError(
        error,
        response,
        this.auditLogger,
        request.log,
        `Failed to get case(s) edit information, questionnaire: ${sanitisedQuestionnaireNameRaw}, current user: {name: ${sanitisedUsername}, role: ${sanitisedCurrentUserRole}}`,
      );
    }
  }

  async getCaseEditInformationForRole(
    questionnaireName: string,
    requestedUserRole: string,
    username: string,
    currentUserRole: string,
    request: Request<{ questionnaireName: string }>,
  ): Promise<CaseEditInformation[]> {
    const cases = await this.blaiseApi.getCaseEditInformation(questionnaireName);
    const sanitisedQuestionnaireName = sanitiseForLogging(questionnaireName);
    const sanitisedUsername = sanitiseForLogging(username);
    const sanitisedCurrentUserRole = sanitiseForLogging(currentUserRole);

    this.auditLogger.info(
      request.log,
      `Retrieved ${cases.length} case(s) edit information, questionnaire: ${sanitisedQuestionnaireName}, current user: {name: ${sanitisedUsername}, role: ${sanitisedCurrentUserRole}}`,
    );

    const surveyTla = questionnaireName.substring(0, 3);
    const roleConfig = this.configuration.getSurveyConfigForRole(surveyTla, requestedUserRole);

    const filteredCases = cases
      .filter((caseEditInformation) =>
        roleConfig.Organisations.length > 0
          ? roleConfig.Organisations.includes(caseEditInformation.organisation)
          : true,
      )
      .filter((caseEditInformation) =>
        roleConfig.Outcomes.length > 0
          ? roleConfig.Outcomes.includes(caseEditInformation.outcome)
          : true,
      );

    this.auditLogger.info(
      request.log,
      `Filtered down to ${filteredCases.length} case(s) edit information, questionnaire: ${sanitisedQuestionnaireName}, current user: {name: ${sanitisedUsername}, role: ${sanitisedCurrentUserRole}}`,
    );

    return filteredCases;
  }

  async updateCasesWithConcurrencyLimit(
    questionnaireName: string,
    caseIds: string[],
    caseFields: Record<string, string | number>,
  ): Promise<void> {
    for (
      let startIndex = 0;
      startIndex < caseIds.length;
      startIndex += CASE_ALLOCATION_CONCURRENCY_LIMIT
    ) {
      const caseBatch = caseIds.slice(startIndex, startIndex + CASE_ALLOCATION_CONCURRENCY_LIMIT);

      await Promise.all(
        caseBatch.map((caseId) => this.blaiseApi.updateCase(questionnaireName, caseId, caseFields)),
      );
    }
  }

  async allocateCases(
    request: Request<
      { questionnaireName: string },
      Record<string, never>,
      { name: string; cases: string[] },
      Record<string, never>
    >,
    response: Response,
  ) {
    const questionnaireNameRaw = request.params.questionnaireName;
    const { name, cases } = request.body;

    const { role: currentUserRole, username } = getRequestUserContext(request, this.auth);
    const sanitisedName = sanitiseForLogging(name);
    const sanitisedQuestionnaireNameRaw = sanitiseForLogging(questionnaireNameRaw);
    const sanitisedUsername = sanitiseForLogging(username);
    const sanitisedCurrentUserRole = sanitiseForLogging(currentUserRole);

    try {
      const questionnaireName = validateQuestionnaireName(questionnaireNameRaw);
      const sanitisedQuestionnaireName = sanitiseForLogging(questionnaireName);

      await this.updateCasesWithConcurrencyLimit(questionnaireName, cases, {
        "QEdit.AssignedTo": name,
        "QEdit.Edited": 1,
      });
      this.auditLogger.info(
        request.log,
        `Allocated ${cases.length} cases to editor: ${sanitisedName}, questionnaire: ${sanitisedQuestionnaireName}, current user: {name: ${sanitisedUsername}, role: ${sanitisedCurrentUserRole}}`,
      );

      return response.status(204).json();
    } catch (error: unknown) {
      return handleApiError(
        error,
        response,
        this.auditLogger,
        request.log,
        `Failed to allocate cases to editor: ${sanitisedName}, questionnaire: ${sanitisedQuestionnaireNameRaw}, current user: {name: ${sanitisedUsername}, role: ${sanitisedCurrentUserRole}}`,
      );
    }
  }

  async setCaseToUpdate(
    request: Request<
      { questionnaireName: string; caseId: string },
      Record<string, never>,
      Record<string, never>,
      Record<string, never>
    >,
    response: Response,
  ) {
    const { caseId } = request.params;
    const questionnaireNameRaw = request.params.questionnaireName;
    const { role: currentUserRole, username } = getRequestUserContext(request, this.auth);
    const sanitisedCaseId = sanitiseForLogging(caseId);
    const sanitisedQuestionnaireNameRaw = sanitiseForLogging(questionnaireNameRaw);
    const sanitisedUsername = sanitiseForLogging(username);
    const sanitisedCurrentUserRole = sanitiseForLogging(currentUserRole);

    try {
      const questionnaireName = validateQuestionnaireName(questionnaireNameRaw);
      const sanitisedQuestionnaireName = sanitiseForLogging(questionnaireName);

      await this.blaiseApi.updateCase(`${questionnaireName}_EDIT`, caseId, {
        "QEdit.AssignedTo": "",
        "QEdit.Edited": "",
        "QEdit.LastUpdated": moment("1900-01-01").format("DD-MM-YYYY_HH:mm"),
      });
      this.auditLogger.info(
        request.log,
        `Set to update edit dataset overnight, case: ${sanitisedCaseId}, questionnaire: ${sanitisedQuestionnaireName}, current user: {name: ${sanitisedUsername}, role: ${sanitisedCurrentUserRole}}`,
      );

      return response.status(204).json();
    } catch (error: unknown) {
      return handleApiError(
        error,
        response,
        this.auditLogger,
        request.log,
        `Failed to set to update edit dataset overnight, case: ${sanitisedCaseId}, questionnaire: ${sanitisedQuestionnaireNameRaw}, current user: {name: ${sanitisedUsername}, role: ${sanitisedCurrentUserRole}}`,
      );
    }
  }
}
