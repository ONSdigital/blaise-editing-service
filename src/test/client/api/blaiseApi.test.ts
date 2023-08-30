import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getCases, getSurveys, getCaseFactsheet } from '../../../client/clients/serverApi';
import CaseBuilder from '../../builders/caseBuilder';
import { CaseFactsheetDetails } from '../../../common/interfaces/caseInterface';
import CaseDetailsBuilder from '../../builders/caseDetailsBuilder';
import surveyListMockObject from '../../mockObjects/surveyListMockObject';

const mock = new MockAdapter(axios, { onNoMatch: 'throwException' });

describe('GetSurveys from Blaise', () => {
  it('Should retrieve a list of surveys in blaise with a 200 response', async () => {
    // arrange
    mock.onGet('/api/surveys').reply(200, surveyListMockObject);

    // act
    const result = await getSurveys();

    // assert
    expect(result).toEqual(surveyListMockObject);
  });

  it('Should throw the error "Unable to find surveys, please contact Richmond Rice" when a 404 response is recieved', async () => {
    // arrange
    mock.onGet('/api/surveys').reply(404, null);

    // act && assert
    expect(getSurveys()).rejects.toThrow(/Unable to find surveys, please contact Richmond Rice/);
  });

  it('Should throw the error "Unable to retrieve surveys, please try again in a few minutes" when a 500 response is recieved', async () => {
    // arrange
    mock.onGet('/api/surveys').reply(500, null);

    // act && assert
    expect(getSurveys()).rejects.toThrow(/Unable to retrieve surveys, please try again in a few minutes/);
  });

  it('Should throw the error "Unable to retrieve surveys, please try again in a few minutes" when there is a network error', async () => {
    // arrange
    mock.onGet('/api/surveys').networkError();

    // act && assert
    expect(getSurveys()).rejects.toThrow(/Unable to retrieve surveys, please try again in a few minutes/);
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
