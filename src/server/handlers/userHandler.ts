import { type Auth } from "blaise-login-react-server";
import express from "express";

import getRequestUserContext from "../helpers/getRequestUserContext.js";
import handleApiError from "../helpers/handleApiError.js";
import { sanitiseForLogging } from "../utils/sanitisation.js";
import { validateUserRole } from "../utils/validation.js";

import type { Controller } from "../controller.js";
import type AuditLogger from "../utils/auditLogger.js";
import type BlaiseApi from "../utils/blaiseApi.js";
import type { ConfigurationProvider } from "../utils/serverConfigurationProvider.js";
import type { User } from "blaise-api-node-client";
import type { Request, Response } from "express";

export default class UserHandler implements Controller {
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
    this.getUsers = this.getUsers.bind(this);
    this.auth = auth;
    this.auditLogger = auditLogger;
  }

  getRoutes() {
    const router = express.Router();

    return router.get("/api/users", this.auth.middleware, this.getUsers);
  }

  async getUsers(
    request: Request<
      Record<string, never>,
      Record<string, never>,
      Record<string, never>,
      { userRole: string }
    >,
    response: Response<User[]>,
  ) {
    const { role: currentUserRole, username } = getRequestUserContext(request, this.auth);
    const userRoleRaw = request.query.userRole;
    const sanitisedUsername = sanitiseForLogging(username);
    const sanitisedCurrentUserRole = sanitiseForLogging(currentUserRole);

    try {
      if (userRoleRaw !== undefined) {
        validateUserRole(userRoleRaw);
      }

      const userList = await this.blaiseApi.getUsers();

      this.auditLogger.info(
        request.log,
        sanitiseForLogging(
          `Retrieved ${userList.length} user(s), current user: {name: ${sanitisedUsername}, role: ${sanitisedCurrentUserRole}}`,
        ),
      );
      if (userRoleRaw) {
        const userRole = userRoleRaw;
        const filteredUserList = userList.filter((filteredUser) => filteredUser.role === userRole);

        this.auditLogger.info(
          request.log,
          sanitiseForLogging(
            `Filtered down to ${filteredUserList.length} user(s), current user: {name: ${sanitisedUsername}, role: ${sanitisedCurrentUserRole}}`,
          ),
        );

        return response.status(200).json(filteredUserList);
      }

      return response.status(200).json(userList);
    } catch (error: unknown) {
      return handleApiError(
        error,
        response,
        this.auditLogger,
        request.log,
        `Failed to get Users, current user: {name: ${sanitisedUsername}, role: ${sanitisedCurrentUserRole}}`,
      );
    }
  }
}
