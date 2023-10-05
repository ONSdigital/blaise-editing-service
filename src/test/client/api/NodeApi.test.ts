import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import surveyListMockObject from '../../mockObjects/surveyListMockObject';
import {
  getAllocationDetails, getCaseFactsheet, getCases, getSurveys,
} from '../../../client/api/NodeApi';
import { caseDetailsListMockObject, caseFactsheetMockObject } from '../../mockObjects/caseMockObject';
import { allocationDetailsMockObject } from '../../mockObjects/questionnaireAllocationMockObject';

// use axios mock adapter
const axiosMock = new MockAdapter(axios, { onNoMatch: 'throwException' });

describe('GetSurveys from Blaise', () => {
  it('Should retrieve a list of surveys in blaise with a 200 response', async () => {
    // arrange
    axiosMock.onGet('/api/surveys').reply(200, surveyListMockObject);

    // act
    const result = await getSurveys();

    // assert
    expect(result).toEqual(surveyListMockObject);
  });

  it('Should throw the error "Unable to find surveys, please contact Richmond Rice" when a 404 response is recieved', async () => {
    // arrange
    axiosMock.onGet('/api/surveys').reply(404, null);

    // act && assert
    expect(getSurveys()).rejects.toThrow('Unable to find surveys, please contact Richmond Rice');
  });

  it('Should throw the error "Unable to retrieve surveys, please try again in a few minutes" when a 500 response is recieved', async () => {
    // arrange
    axiosMock.onGet('/api/surveys').reply(500, null);

    // act && assert
    expect(getSurveys()).rejects.toThrow('Unable to complete request, please try again in a few minutes');
  });

  it('Should throw the error "Unable to retrieve surveys, please try again in a few minutes" when there is a network error', async () => {
    // arrange
    axiosMock.onGet('/api/surveys').networkError();

    // act && assert
    expect(getSurveys()).rejects.toThrow('Unable to complete request, please try again in a few minutes');
  });
});

describe('GetCases from Blaise', () => {
  const questionnaireName = 'LMS2201_LT1';
  const username = 'Toby';

  it('Should retrieve a list of cases in blaise with a 200 response', async () => {
    // arrange
    axiosMock.onGet(`/api/questionnaires/${questionnaireName}/cases?username=${username}`).reply(200, caseDetailsListMockObject);

    // act
    const result = await getCases(questionnaireName, username);

    // assert
    expect(result).toEqual(caseDetailsListMockObject);
  });

  it('Should throw the error "The questionnaire is no longer available', async () => {
    // arrange
    axiosMock.onGet(`/api/questionnaires/${questionnaireName}/cases?username=${username}`).reply(404, null);

    // act && assert
    expect(getCases(questionnaireName, username)).rejects.toThrow(/The questionnaire is no longer available/);
  });

  it('Should throw the error "Unable to retrieve cases, please try again in a few minutes" when a 500 response is recieved', async () => {
    // arrange
    axiosMock.onGet(`/api/questionnaires/${questionnaireName}/cases?username=${username}`).reply(500, null);

    // act && assert
    expect(getCases(questionnaireName, username)).rejects.toThrow('Unable to complete request, please try again in a few minutes');
  });

  it('Should throw the error "Unable to retrieve cases, please try again in a few minutes" when there is a network error', async () => {
    // arrange
    axiosMock.onGet(`/api/questionnaires/${questionnaireName}/cases?username=${username}`).networkError();

    // act && assert
    expect(getCases(questionnaireName, username)).rejects.toThrow('Unable to complete request, please try again in a few minutes');
  });
});

describe('GetCaseFactsheet from Blaise', () => {
  const questionnaireName = 'LMS2201_LT1';
  const caseId = '900001';

  it('Should retrieve a list of cases in blaise with a 200 response', async () => {
    // arrange
    axiosMock.onGet(`/api/questionnaires/${questionnaireName}/cases/${caseId}/factsheet`).reply(200, caseFactsheetMockObject);

    // act
    const result = await getCaseFactsheet(questionnaireName, caseId);

    // assert
    expect(JSON.stringify(result)).toEqual(JSON.stringify(caseFactsheetMockObject));
  });

  it('Should throw the error "The questionnaire is no longer available', async () => {
    // arrange
    axiosMock.onGet(`/api/questionnaires/${questionnaireName}/cases/${caseId}/factsheet`).reply(404, null);

    // act && assert
    expect(getCaseFactsheet(questionnaireName, caseId)).rejects.toThrow(/The questionnaire is no longer available/);
  });

  it('Should throw the error "Unable to retrieve case factsheet, please try again in a few minutes" when a 500 response is recieved', async () => {
    // arrange
    axiosMock.onGet(`/api/questionnaires/${questionnaireName}/cases/${caseId}/factsheet`).reply(500, null);

    // act && assert
    expect(getCaseFactsheet(questionnaireName, caseId)).rejects.toThrow('Unable to complete request, please try again in a few minutes');
  });

  it('Should throw the error "Unable to retrieve case factsheet, please try again in a few minutes" when there is a network error', async () => {
    // arrange
    axiosMock.onGet(`/api/questionnaires/${questionnaireName}/cases/${caseId}/factsheet`).networkError();

    // act && assert
    expect(getCaseFactsheet(questionnaireName, caseId)).rejects.toThrow('Unable to complete request, please try again in a few minutes');
  });
});

describe('getAllocationDetails from Blaise', () => {
  const questionnaireName = 'LMS2201_LT1';

  it('Should retrieve allocation details with a 200 response', async () => {
    // arrange
    axiosMock.onGet(`/api/questionnaires/${questionnaireName}/allocation`).reply(200, allocationDetailsMockObject);

    // act
    const result = await getAllocationDetails(questionnaireName);

    // assert
    expect(JSON.stringify(result)).toEqual(JSON.stringify(allocationDetailsMockObject));
  });

  it('Should throw the error "The questionnaire is no longer available', async () => {
    // arrange
    axiosMock.onGet(`/api/questionnaires/${questionnaireName}/allocation`).reply(404, null);

    // act && assert
    expect(getAllocationDetails(questionnaireName)).rejects.toThrow(/The questionnaire is no longer available/);
  });

  it('Should throw the error "Unable to retrieve case factsheet, please try again in a few minutes" when a 500 response is recieved', async () => {
    // arrange
    axiosMock.onGet(`/api/questionnaires/${questionnaireName}/allocation`).reply(500, null);

    // act && assert
    expect(getAllocationDetails(questionnaireName)).rejects.toThrow('Unable to complete request, please try again in a few minutes');
  });

  it('Should throw the error "Unable to retrieve case factsheet, please try again in a few minutes" when there is a network error', async () => {
    // arrange
    axiosMock.onGet(`/api/questionnaires/${questionnaireName}/allocation`).networkError();

    // act && assert
    expect(getAllocationDetails(questionnaireName)).rejects.toThrow('Unable to complete request, please try again in a few minutes');
  });
});
