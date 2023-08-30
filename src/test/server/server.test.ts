import listEndpoints, { Endpoint } from 'express-list-endpoints';
import BlaiseApiClient from 'blaise-api-node-client';
import { IMock, Mock } from 'typemoq';
import NodeServer from '../../server/server';
import FakeConfigurationProvider from './configuration/FakeConfigurationProvider';

// create fake config
const configFake = new FakeConfigurationProvider('restapi.blaise.com', 'dist', 5000, 'gusty', 'cati.blaise.com', 'richlikesricecakes', '12h', ['DST']);

// mock blaise api client
const blaiseApiClientMock: IMock<BlaiseApiClient> = Mock.ofType(BlaiseApiClient);

// create service to test
const sut = NodeServer(configFake, blaiseApiClientMock.object);

describe('All expected routes are registered', () => {
  it('should contain expected routes', async () => {
    // arrange

    const expectedEndpoints:Endpoint[] = [
      // needs to be in the same order they are added to the server
      { methods: ['GET'], middlewares: ['bound '], path: '/api/surveys' },
      { methods: ['GET'], middlewares: ['bound '], path: '/api/questionnaires/:questionnaireName/cases' },
      { methods: ['GET'], middlewares: ['bound '], path: '/api/questionnaires/:questionnaireName/cases/:caseId/factsheet' },
      { methods: ['GET'], middlewares: ['bound '], path: '/api/login/users/:username' },
      { methods: ['GET'], middlewares: ['bound '], path: '/api/login/current-user' },
      { methods: ['GET'], middlewares: ['bound '], path: '/api/login/users/:username/authorised' },
      { methods: ['POST'], middlewares: ['bound '], path: '/api/login/token/validate' },
      { methods: ['POST'], middlewares: ['bound '], path: '/api/login/users/password/validate' },
      { methods: ['GET'], middlewares: ['anonymous'], path: '*' },
    ];

    // act
    const actualEndpoints = listEndpoints(sut);

    // assert
    expect(actualEndpoints).toEqual(expectedEndpoints);
  });
});
