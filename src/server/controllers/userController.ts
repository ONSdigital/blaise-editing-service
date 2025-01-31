import express, { Request, Response } from 'express';
import { User } from 'blaise-api-node-client';
import { Auth } from 'blaise-login-react-server';
import { Controller } from '../interfaces/controllerInterface';
import notFound from '../helpers/axiosHelper';
import BlaiseApi from '../api/BlaiseApi';
import ServerConfigurationProvider from '../configuration/ServerConfigurationProvider';

export default class UserController implements Controller {
  blaiseApi: BlaiseApi;

  configuration: ServerConfigurationProvider;

  constructor(blaiseApi: BlaiseApi, configuration: ServerConfigurationProvider) {
    this.blaiseApi = blaiseApi;
    this.configuration = configuration;
    this.getUsers = this.getUsers.bind(this);
  }

  getRoutes() {
    const auth = new Auth(this.configuration);
    const router = express.Router();
    return router.get('/api/users', auth.Middleware, this.getUsers);
  }

  async getUsers(request: Request<{}, {}, {}, { userRole:string }>, response: Response<User[]>) {
    try {
      const userList = await this.blaiseApi.getUsers();
      this.blaiseApi.cloudLogger.info(`Retrieved ${userList.length} user(s)`);
      if (request.query.userRole) {
        const { userRole } = request.query;
        const filteredUserList = userList.filter((user) => user.role === userRole);

        this.blaiseApi.cloudLogger.info(`Filtered down to ${filteredUserList.length} user(s), role: ${userRole}`);
        return response.status(200).json(filteredUserList);
      }

      return response.status(200).json(userList);
    } catch (error: unknown) {
      if (notFound(error)) {
        this.blaiseApi.cloudLogger.error(`Failed to get Users with 404 error: ${error}`);
        return response.status(404).json();
      }
      this.blaiseApi.cloudLogger.error(`Failed to get Users with 500 error: ${error}`);
      return response.status(500).json();
    }
  }
}
