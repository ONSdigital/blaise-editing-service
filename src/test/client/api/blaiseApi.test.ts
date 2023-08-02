import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { QuestionnaireListMockObject } from 'blaise-api-node-client';
import { getQuestionnaires } from '../../../client/api/blaiseApi';

const mock = new MockAdapter(axios, { onNoMatch: 'throwException' });

describe('GetQuestionnaires form Blaise', () => {
  it('Should retrieve a list of questionnaires in blaise with a 200 response', async () => {
    // arrange
    mock.onGet('/api/questionnaires').reply(200, QuestionnaireListMockObject);

    // act
    const result = await getQuestionnaires();

    // assert
    expect(result).toEqual(QuestionnaireListMockObject);
  });

  it('Should throw the error "Unable to find questionnaires, please contact Richmond Rice" when a 404 response is recieved', async () => {
    // arrange
    mock.onGet('/api/questionnaires').reply(404, null);

    // act && assert
    expect(getQuestionnaires()).rejects.toThrow(/Unable to find questionnaires, please contact Richmond Rice/);
  });

  it('Should throw the error "Unable to retrieve questionnaires, please try again in a few minutes" when a 500 response is recieved', async () => {
    // arrange
    mock.onGet('/api/questionnaires').reply(500, null);

    // act && assert
    expect(getQuestionnaires()).rejects.toThrow(/Unable to retrieve questionnaires, please try again in a few minutes/);
  });

  it('Should throw the error "Unable to retrieve questionnaires, please try again in a few minutes" when there is a network error', async () => {
    // arrange
    mock.onGet('/api/questionnaires').networkError();

    // act && assert
    expect(getQuestionnaires()).rejects.toThrow(/Unable to retrieve questionnaires, please try again in a few minutes/);
  });
});
