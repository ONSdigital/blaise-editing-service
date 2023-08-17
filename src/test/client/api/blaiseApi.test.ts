import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { QuestionnaireListMockObject } from 'blaise-api-node-client';
import { getCases, getQuestionnaires, getCaseFactsheet } from '../../../client/api/blaiseApi';
import CaseBuilder from '../../builders/caseBuilder';
import { CaseFactsheetDetails } from '../../../common/interfaces/caseInterface';
import CaseDetailsBuilder from '../../builders/caseDetailsBuilder';

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

  it.each([1, 2, 3, 4])('Should retrieve a list of cases in blaise with a 200 response', async (value) => {
    // arrange
    const caseDetailsBuider = new CaseDetailsBuilder(value);
    const caseDetailsListMockObject = caseDetailsBuider.BuildCaseDetails();
    mock.onGet(`/api/questionnaires/${questionnaireName}/cases`).reply(200, caseDetailsListMockObject);

    // act
    const result = await getCases(questionnaireName);

    // assert
    expect(result).toEqual(caseDetailsListMockObject);
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

describe('GetCaseFactsheet from Blaise', () => {
  const questionnaireName = 'LMS2201_LT1';
  const caseId = '900001';
  const caseBuilder = new CaseBuilder(1);
  const expectedCaseFactsheet: CaseFactsheetDetails = caseBuilder.buildCaseFactsheet();

  it('Should retrieve a list of cases in blaise with a 200 response', async () => {
    // arrange
    mock.onGet(`/api/questionnaires/${questionnaireName}/cases/${caseId}/factsheet`).reply(200, expectedCaseFactsheet);

    // act
    const result = await getCaseFactsheet(questionnaireName, caseId);

    // assert
    expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedCaseFactsheet));
  });

  it('Should throw the error "The questionnaire is no longer available', async () => {
    // arrange
    mock.onGet(`/api/questionnaires/${questionnaireName}/cases/${caseId}/factsheet`).reply(404, null);

    // act && assert
    expect(getCaseFactsheet(questionnaireName, caseId)).rejects.toThrow(/The questionnaire is no longer available/);
  });

  it('Should throw the error "Unable to retrieve case factsheet, please try again in a few minutes" when a 500 response is recieved', async () => {
    // arrange
    mock.onGet(`/api/questionnaires/${questionnaireName}/cases/${caseId}/factsheet`).reply(500, null);

    // act && assert
    expect(getCaseFactsheet(questionnaireName, caseId)).rejects.toThrow(/Unable to retrieve case factsheet, please try again in a few minutes/);
  });

  it('Should throw the error "Unable to retrieve case factsheet, please try again in a few minutes" when there is a network error', async () => {
    // arrange
    mock.onGet(`/api/questionnaires/${questionnaireName}/cases/${caseId}/factsheet`).networkError();

    // act && assert
    expect(getCaseFactsheet(questionnaireName, caseId)).rejects.toThrow(/Unable to retrieve case factsheet, please try again in a few minutes/);
  });
});
