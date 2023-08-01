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

  it('Should throw an error with the message "Unable to find questionnaires, please contact Richmond Rice" when a 404 response is recieved', async () => {
    // arrange
    mock.onGet('/api/questionnaires').reply(404, null);

    // act
    // assert
    try {
      await getQuestionnaires();
      expect(true).toBe(false);
    } catch (error) {
      expect((<Error>error).message).toBe('Unable to find questionnaires, please contact Richmond Rice');
    }
  });

  it('Should throw an error with the message "Unable to retrieve questionnaires, please try again in a few minutes" when a 500 response is recieved', async () => {
    // arrange
    mock.onGet('/api/questionnaires').reply(500, null);

    // act
    // assert
    try {
      await getQuestionnaires();
      expect(true).toBe(false);
    } catch (error) {
      expect((<Error>error).message).toBe('Unable to retrieve questionnaires, please try again in a few minutes');
    }
  });
});
