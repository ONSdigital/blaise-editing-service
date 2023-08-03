import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { QuestionnaireListMockObject } from 'blaise-api-node-client';
import { getCases, getQuestionnaires } from '../../../client/api/blaiseApi';
import caseDetailsList from '../../mockObjects/caseMocks';

const mock = new MockAdapter(axios, { onNoMatch: 'throwException' });

describe('GetQuestionnaires from Blaise', () => {
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

describe('GetCases from Blaise', () => {
  const questionnaireName = 'LMS2201_LT1';

  it('Should retrieve a list of cases in blaise with a 200 response', async () => {
    // arrange
    mock.onGet(`/api/questionnaires/${questionnaireName}/cases`).reply(200, caseDetailsList);

    // act
    const result = await getCases(questionnaireName);

    // assert
    expect(result).toEqual(caseDetailsList);
  });

  it('Should throw the error "The questionnaire is no longer available', async () => {
    // arrange
    mock.onGet(`/api/questionnaires/${questionnaireName}/cases`).reply(404, null);

    // act && assert
    expect(getCases(questionnaireName)).rejects.toThrow(/The questionnaire is no longer available/);
  });

  it('Should throw the error "Unable to retrieve cases, please try again in a few minutes" when a 500 response is recieved', async () => {
    // arrange
    mock.onGet(`/api/questionnaires/${questionnaireName}/cases`).reply(500, null);

    // act && assert
    expect(getCases(questionnaireName)).rejects.toThrow(/Unable to retrieve cases, please try again in a few minutes/);
  });

  it('Should throw the error "Unable to retrieve cases, please try again in a few minutes" when there is a network error', async () => {
    // arrange
    mock.onGet(`/api/questionnaires/${questionnaireName}/cases`).networkError();

    // act && assert
    expect(getCases(questionnaireName)).rejects.toThrow(/Unable to retrieve cases, please try again in a few minutes/);
  });
});
