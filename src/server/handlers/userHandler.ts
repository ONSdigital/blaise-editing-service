import express, { Request, Response } from 'express';
import { User } from 'blaise-api-node-client';
import { Auth } from 'blaise-login-react/blaise-login-react-server';
import { Controller } from '../controllerInterface';
import notFound from '../helpers/axiosHelper';
import BlaiseApi from '../BlaiseApi';
import AuditLogger from "../auditLogger";
import ServerConfigurationProvider from '../ServerConfigurationProvider';

export default class UserHandler implements Controller {
  blaiseApi: BlaiseApi;
  configuration: ServerConfigurationProvider;
  auth: Auth;
  auditLogger: AuditLogger;

  constructor(blaiseApi: BlaiseApi, configuration: ServerConfigurationProvider, auth: Auth, auditLogger: AuditLogger) {
    this.blaiseApi = blaiseApi;
    this.configuration = configuration;
    this.getUsers = this.getUsers.bind(this);
    this.auth = auth;
    this.auditLogger = auditLogger;
  }

  getRoutes() {
    const router = express.Router();
    return router.get('/api/users', this.auth.Middleware, this.getUsers);
  }

  async getUsers(request: Request<Record<string, never>, Record<string, never>, Record<string, never>, { userRole: string }>, response: Response<User[]>) {
    const user = this.auth.GetUser(this.auth.GetToken(request));
    try {
      const userList = await this.blaiseApi.getUsers();
      this.auditLogger.info(request.log, `Retrieved ${userList.length} user(s), current user: {name: ${user.name}, role: ${user.role}}`);
      if (request.query.userRole) {
        const { userRole } = request.query;
        const filteredUserList = userList.filter((filteredUser) => filteredUser.role === userRole);

        this.auditLogger.info(request.log, `Filtered down to ${filteredUserList.length} user(s), current user: {name: ${user.name}, role: ${user.role}}`);
        return response.status(200).json(filteredUserList);
      }

      return response.status(200).json(userList);
    } catch (error: unknown) {
      if (notFound(error)) {
        this.auditLogger.error(request.log, `Failed to get Users, current user: {name: ${user.name}, role: ${user.role}} with 404 ${error}`);
        return response.status(404).json();
      }
      this.auditLogger.error(request.log, `Failed to get Users, current user: {name: ${user.name}, role: ${user.role}} with 500 ${error}`);
      return response.status(500).json();
    }
  }
}
