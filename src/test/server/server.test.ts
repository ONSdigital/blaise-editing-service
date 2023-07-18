import listEndpoints, { Endpoint } from 'express-list-endpoints';
import BlaiseApiClient from 'blaise-api-node-client';
import { IMock, Mock } from 'typemoq';
import NodeServer from '../../server/server';
import FakeConfiguration from './configuration/configuration.fake';

// create fake config
const configFake = new FakeConfiguration('restapi.blaise.com', 'dist', 5000, 'gusty', 'cati.blaise.com');

// mock blaise api client
const blaiseApiClientMock: IMock<BlaiseApiClient> = Mock.ofType(BlaiseApiClient);

// create service to test
const sut = NodeServer(configFake, blaiseApiClientMock.object);

describe('All expected routes are registered', () => {
  it('should contain expected routes', async () => {
    // arrange

    const expectedEndpoints:Endpoint[] = [
      // needs to be in the same order they are added to the server
      { methods: ['GET'], middlewares: ['bound '], path: '/api/questionnaires' },
      { methods: ['GET'], middlewares: ['bound '], path: '/api/questionnaires/:questionnaireName/cases' },
      { methods: ['GET'], middlewares: ['anonymous'], path: '*' },
    ];

    // act
    const actualEndpoints = listEndpoints(sut);

    // assert
    expect(actualEndpoints).toEqual(expectedEndpoints);
  });
});
