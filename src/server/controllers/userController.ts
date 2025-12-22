import express, { Request, Response } from 'express';
import { User } from 'blaise-api-node-client';
import { Auth } from 'blaise-login-react/blaise-login-react-server';
import { Controller } from '../interfaces/controllerInterface';
import notFound from '../helpers/axiosHelper';
import BlaiseApi from '../api/BlaiseApi';
import ServerConfigurationProvider from '../configuration/ServerConfigurationProvider';

export default class UserController implements Controller {
  blaiseApi: BlaiseApi;

  configuration: ServerConfigurationProvider;

  auth: Auth;

  constructor(blaiseApi: BlaiseApi, configuration: ServerConfigurationProvider, auth: Auth) {
    this.blaiseApi = blaiseApi;
    this.configuration = configuration;
    this.getUsers = this.getUsers.bind(this);
    this.auth = auth;
  }

  getRoutes() {
    const router = express.Router();
    return router.get('/api/users', this.auth.Middleware, this.getUsers);
  }

  async getUsers(request: Request<Record<string, never>, Record<string, never>, Record<string, never>, { userRole: string }>, response: Response<User[]>) {
    const user = this.auth.GetUser(this.auth.GetToken(request));
    try {
      const userList = await this.blaiseApi.getUsers();
      this.blaiseApi.cloudLogger.info(`Retrieved ${userList.length} user(s), current user: {name: ${user.name}, role: ${user.role}}`);
      if (request.query.userRole) {
        const { userRole } = request.query;
        const filteredUserList = userList.filter((filteredUser) => filteredUser.role === userRole);

        this.blaiseApi.cloudLogger.info(`Filtered down to ${filteredUserList.length} user(s), current user: {name: ${user.name}, role: ${user.role}}`);
        return response.status(200).json(filteredUserList);
      }

      return response.status(200).json(userList);
    } catch (error: unknown) {
      if (notFound(error)) {
        this.blaiseApi.cloudLogger.error(`Failed to get Users, current user: {name: ${user.name}, role: ${user.role}} with 404 ${error}`);
        return response.status(404).json();
      }
      this.blaiseApi.cloudLogger.error(`Failed to get Users, current user: {name: ${user.name}, role: ${user.role}} with 500 ${error}`);
      return response.status(500).json();
    }
  }
}
