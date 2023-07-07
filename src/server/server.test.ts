import listEndpoints, { Endpoint } from 'express-list-endpoints';
import BlaiseApiClient from 'blaise-api-node-client';
import { IMock, Mock } from 'typemoq';
import { Config } from './config';
import NodeServer from './server';

// mock config
const configMock:IMock<Config> = Mock.ofType<Config>();
configMock.setup((config) => config.BuildFolder).returns(() => 'dist');

// mock blaise api client
const blaiseApiClientMock: IMock<BlaiseApiClient> = Mock.ofType(BlaiseApiClient);

// create service to test
const sut = NodeServer(configMock.object, blaiseApiClientMock.object);

describe('All expected routes are registered', () => {
  it('should contain expected routes', async () => {
    // arrange

    const expectedEndpoints:Endpoint[] = [
      // needs to be in the same order they are added to the server
      { methods: ['GET'], middlewares: ['bound '], path: '/api/questionnaires' },
      { methods: ['GET'], middlewares: ['bound '], path: '/api/questionnaires/:questionnaireName/cases/status' },
      { methods: ['GET'], middlewares: ['anonymous'], path: '*' },
    ];

    // act
    const actualEndpoints = listEndpoints(sut);

    // assert
    expect(actualEndpoints).toEqual(expectedEndpoints);
  });
});
