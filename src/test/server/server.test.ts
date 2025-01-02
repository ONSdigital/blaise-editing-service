/*
* @jest-environment node
*/
import listEndpoints, { Endpoint } from 'express-list-endpoints';
import { IMock, Mock } from 'typemoq';
import supertest from 'supertest';
import path from 'path';
import NodeServer from '../../server/server';
import BlaiseApi from '../../server/api/BlaiseApi';
import FakeServerConfigurationProvider from './configuration/FakeServerConfigurationProvider';

// create fake config
const configFake = new FakeServerConfigurationProvider();

// mock blaise api client
const blaiseApiMock: IMock<BlaiseApi> = Mock.ofType(BlaiseApi);

// create service to test
const server = NodeServer(configFake, blaiseApiMock.object);

describe('All expected routes are registered', () => {
  it('should contain expected routes', async () => {
    // arrange

    const expectedEndpoints:Endpoint[] = [
      // needs to be in the same order they are added to the server
      { methods: ['GET'], middlewares: ['bound ', 'bound getSurveys'], path: '/api/surveys' },
      { methods: ['GET'], middlewares: ['bound ', 'bound getCaseSummary'], path: '/api/questionnaires/:questionnaireName/cases/:caseId/summary' },
      { methods: ['GET'], middlewares: ['bound ', 'bound getCaseEditInformation'], path: '/api/questionnaires/:questionnaireName/cases/edit' },
      { methods: ['PATCH'], middlewares: ['bound ', 'bound allocateCases'], path: '/api/questionnaires/:questionnaireName/cases/allocate' },
      { methods: ['GET'], middlewares: ['bound ', 'bound getUsers'], path: '/api/users' },
      { methods: ['GET'], middlewares: ['bound '], path: '/api/login/users/:username' },
      { methods: ['GET'], middlewares: ['bound '], path: '/api/login/current-user' },
      { methods: ['GET'], middlewares: ['bound '], path: '/api/login/users/:username/authorised' },
      { methods: ['POST'], middlewares: ['bound '], path: '/api/login/token/validate' },
      { methods: ['POST'], middlewares: ['bound '], path: '/api/login/users/password/validate' },
      { methods: ['GET'], middlewares: ['anonymous'], path: '*' },
    ];

    // act
    const actualEndpoints = listEndpoints(server);

    // assert
    expect(actualEndpoints).toEqual(expectedEndpoints);
  });
});

describe('Render react pages as default route', () => {
  it('should render the home page', async () => {
    // arrange
    server.set('views', path.join(__dirname, '../../../build'));
    const sut = supertest(server);

    // act
    const result = await sut.get('/');

    // assert
    expect(result.error).toBeFalsy();
    expect(result.statusCode).toEqual(200);
    expect(result.type).toEqual('text/html');
    expect(result.text).toContain('Edit interview data and view statistics on editing progress');
  });
});
