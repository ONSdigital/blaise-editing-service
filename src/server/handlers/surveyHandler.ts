import { type Auth } from "blaise-login-react-server";
import express from "express";

import getRequestUserContext from "../helpers/getRequestUserContext.js";
import handleApiError from "../helpers/handleApiError.js";
import { sanitiseForLogging } from "../utils/sanitisation.js";
import toSurveys from "../utils/surveyMapper.js";
import { validateUserRole } from "../utils/validation.js";

import type { QuestionnaireDetails, Survey } from "../../common/types/survey.types.js";
import type { Controller } from "../controller.js";
import type AuditLogger from "../utils/auditLogger.js";
import type BlaiseApi from "../utils/blaiseApi.js";
import type { ConfigurationProvider } from "../utils/serverConfigurationProvider.js";
import type { Request, Response } from "express";

export default class SurveyHandler implements Controller {
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
    this.getSurveys = this.getSurveys.bind(this);
    this.auth = auth;
    this.auditLogger = auditLogger;
  }

  getRoutes() {
    const router = express.Router();

    return router.get("/api/surveys", this.auth.middleware, this.getSurveys);
  }

  async getSurveys(
    request: Request<
      Record<string, never>,
      Record<string, never>,
      Record<string, never>,
      { userRole: string }
    >,
    response: Response<Survey[]>,
  ) {
    const userRoleRaw = request.query.userRole;
    const { role: currentUserRole, username } = getRequestUserContext(request, this.auth);
    const sanitisedUsername = sanitiseForLogging(username);
    const sanitisedCurrentUserRole = sanitiseForLogging(currentUserRole);

    try {
      const userRole = validateUserRole(userRoleRaw);
      const questionnaires = await this.getQuestionnairesForRole(
        userRole,
        username,
        currentUserRole,
        request,
      );
      const surveys = toSurveys(questionnaires ?? []);

      return response.status(200).json(surveys);
    } catch (error: unknown) {
      return handleApiError(
        error,
        response,
        this.auditLogger,
        request.log,
        `Failed to get questionnaires, current user: {name: ${sanitisedUsername}, role: ${sanitisedCurrentUserRole}}`,
      );
    }
  }

  async getQuestionnairesForRole(
    userRole: string,
    username: string,
    currentUserRole: string,
    request: Request<Record<string, never>>,
  ): Promise<QuestionnaireDetails[]> {
    const surveys = this.configuration.getSurveysForRole(userRole);
    const questionnaires = await this.blaiseApi.getQuestionnaires();
    const sanitisedUsername = sanitiseForLogging(username);
    const sanitisedCurrentUserRole = sanitiseForLogging(currentUserRole);

    this.auditLogger.info(
      request.log,
      sanitiseForLogging(
        `Retrieved ${questionnaires.length} questionnaire(s), current user: {name: ${sanitisedUsername}, role: ${sanitisedCurrentUserRole}}`,
      ),
    );

    if (userRole === "Survey Support") {
      const questionnairesList = questionnaires
        .filter((q) => surveys.includes(q.surveyTla))
        .filter((q) => !q.questionnaireName.endsWith("_EDIT"));

      this.auditLogger.info(
        request.log,
        sanitiseForLogging(
          `Filtered down to ${questionnairesList.length} questionnaire(s), current user: {name: ${sanitisedUsername}, role: ${sanitisedCurrentUserRole}}`,
        ),
      );

      return questionnairesList;
    }

    const questionnairesList = questionnaires
      .filter((q) => surveys.includes(q.surveyTla))
      .filter((q) => q.questionnaireName.endsWith("_EDIT"));

    this.auditLogger.info(
      request.log,
      sanitiseForLogging(
        `Filtered down to ${questionnairesList.length} questionnaire(s), current user: {name: ${sanitisedUsername}, role: ${sanitisedCurrentUserRole}}`,
      ),
    );

    return questionnairesList;
  }
}
