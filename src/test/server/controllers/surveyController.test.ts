import supertest, { Response } from 'supertest';
import { IMock, Mock, Times } from 'typemoq';
import { Auth } from 'blaise-login-react-server';
import BlaiseApiClient from 'blaise-api-node-client';
import nodeServer from '../../../server/server';
import createAxiosError from './axiosTestHelper';
import BlaiseApi from '../../../server/api/BlaiseApi';
import FakeServerConfigurationProvider from '../configuration/FakeServerConfigurationProvider';
import { QuestionnaireDetails, Survey } from '../../../common/interfaces/surveyInterface';
import GoogleCloudLogger from '../../../server/logger/googleCloudLogger';

// create fake config
const configFake = new FakeServerConfigurationProvider();

// mock auth
Auth.prototype.ValidateToken = jest.fn().mockReturnValue(true);

// mock blaise api client and cloud logger
const blaiseApiClientMock: IMock<BlaiseApiClient> = Mock.ofType(BlaiseApiClient);
const cloudLoggerMock: IMock<GoogleCloudLogger> = Mock.ofType(GoogleCloudLogger);

// create blaise api
const blaiseApi = new BlaiseApi(configFake, blaiseApiClientMock.object, cloudLoggerMock.object);

// mock blaise api client
const blaiseApiMock: IMock<BlaiseApi> = Mock.ofInstance(blaiseApi);

// need to test the endpoints through the express server
const server = nodeServer(configFake, blaiseApiMock.object);

// supertest will handle all http calls
const sut = supertest(server);

describe('Get surveys tests', () => {
  beforeEach(() => {
    blaiseApiMock.reset();
    cloudLoggerMock.reset();
  });

  afterAll(() => {
    blaiseApiMock.reset();
    cloudLoggerMock.reset();
  });

  it.each(['SVT Supervisor', 'SVT Editor', 'FRS Research'])('should return a 200 response with an expected list of surveys for the SVT and research Roles', async (userRole) => {
    // arrange
    // mock blaise client to return a list of questionnaires with allocation

    const questionnaireDetailsListMockObject: QuestionnaireDetails[] = [
      {
        questionnaireName: 'LMS2101_AA1',
        numberOfCases: 3,
        fieldPeriod: 'January 2021',
        surveyTla: 'LMS',
      },
      {
        questionnaireName: 'LMS2101_AA1_EDIT',
        numberOfCases: 3,
        fieldPeriod: 'January 2021',
        surveyTla: 'LMS',
      },
      {
        questionnaireName: 'FRS2408B',
        numberOfCases: 0,
        fieldPeriod: 'August 2024',
        surveyTla: 'FRS',
      },
      {
        questionnaireName: 'FRS2408B_EDIT',
        numberOfCases: 0,
        fieldPeriod: 'August 2024',
        surveyTla: 'FRS',
      },
      {
        questionnaireName: 'FRS2504A',
        numberOfCases: 1,
        fieldPeriod: 'April 2025',
        surveyTla: 'FRS',
      },
      {
        questionnaireName: 'FRS2504A_EDIT',
        numberOfCases: 1,
        fieldPeriod: 'April 2025',
        surveyTla: 'FRS',
      },
      {
        questionnaireName: 'OPN2201A',
        numberOfCases: 3,
        fieldPeriod: 'January 2022',
        surveyTla: 'OPN',
      },
      {
        questionnaireName: 'OPN2201A_EDIT',
        numberOfCases: 3,
        fieldPeriod: 'January 2022',
        surveyTla: 'OPN',
      },
    ];

    const expectedSurveyListMockObject: Survey[] = [
      {
        name: 'FRS',
        questionnaires: [{
          questionnaireName: 'FRS2408B_EDIT',
          numberOfCases: 0,
          fieldPeriod: 'August 2024',
          surveyTla: 'FRS',
        },
        {
          questionnaireName: 'FRS2504A_EDIT',
          numberOfCases: 1,
          fieldPeriod: 'April 2025',
          surveyTla: 'FRS',
        },
        ],
      },
    ];

    blaiseApiMock.setup((api) => api.getQuestionnaires()).returns(async () => questionnaireDetailsListMockObject);

    // act
    const response: Response = await sut.get(`/api/surveys?userRole=${userRole}`);

    // assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(expectedSurveyListMockObject);
    blaiseApiMock.verify((api) => api.getQuestionnaires(), Times.once());
  });

  it.each(['SVT Supervisor', 'SVT Editor', 'FRS Research'])('should log the number of questionnaires and filtered questionnaires for the SVT and research Roles', async (userRole) => {
    // arrange
    // mock blaise client to return a list of questionnaires with allocation

    const questionnaireDetailsListMockObject: QuestionnaireDetails[] = [
      {
        questionnaireName: 'LMS2101_AA1',
        numberOfCases: 3,
        fieldPeriod: 'January 2021',
        surveyTla: 'LMS',
      },
      {
        questionnaireName: 'LMS2101_AA1_EDIT',
        numberOfCases: 3,
        fieldPeriod: 'January 2021',
        surveyTla: 'LMS',
      },
      {
        questionnaireName: 'FRS2408B',
        numberOfCases: 0,
        fieldPeriod: 'August 2024',
        surveyTla: 'FRS',
      },
      {
        questionnaireName: 'FRS2408B_EDIT',
        numberOfCases: 0,
        fieldPeriod: 'August 2024',
        surveyTla: 'FRS',
      },
      {
        questionnaireName: 'FRS2504A',
        numberOfCases: 1,
        fieldPeriod: 'April 2025',
        surveyTla: 'FRS',
      },
      {
        questionnaireName: 'FRS2504A_EDIT',
        numberOfCases: 1,
        fieldPeriod: 'April 2025',
        surveyTla: 'FRS',
      },
      {
        questionnaireName: 'OPN2201A',
        numberOfCases: 3,
        fieldPeriod: 'January 2022',
        surveyTla: 'OPN',
      },
      {
        questionnaireName: 'OPN2201A_EDIT',
        numberOfCases: 3,
        fieldPeriod: 'January 2022',
        surveyTla: 'OPN',
      },
    ];

    const expectedFilteredQuestionnaireListMockObject: QuestionnaireDetails[] = [
      {
        questionnaireName: 'FRS2408B_EDIT',
        numberOfCases: 0,
        fieldPeriod: 'August 2024',
        surveyTla: 'FRS',
      },
      {
        questionnaireName: 'FRS2504A_EDIT',
        numberOfCases: 1,
        fieldPeriod: 'April 2025',
        surveyTla: 'FRS',
      },
    ];

    blaiseApiMock.setup((api) => api.getQuestionnaires()).returns(async () => questionnaireDetailsListMockObject);

    // act
    await sut.get(`/api/surveys?userRole=${userRole}`);

    // assert
    cloudLoggerMock.verify((logger) => logger.info(`Retrieved ${questionnaireDetailsListMockObject.length} questionnaire(s)`), Times.once());
    cloudLoggerMock.verify((logger) => logger.info(`Filtered down to ${expectedFilteredQuestionnaireListMockObject.length} questionnaire(s), role: ${userRole}`), Times.once());
  });

  it('should return a 200 response with an expected list of surveys for the Survey Support Role', async () => {
    // arrange
    const userRole = 'Survey Support';

    // mock blaise client to return a list of questionnaires with allocation

    const questionnaireDetailsListMockObject: QuestionnaireDetails[] = [
      {
        questionnaireName: 'LMS2101_AA1',
        numberOfCases: 3,
        fieldPeriod: 'January 2021',
        surveyTla: 'LMS',
      },
      {
        questionnaireName: 'LMS2101_AA1_EDIT',
        numberOfCases: 3,
        fieldPeriod: 'January 2021',
        surveyTla: 'LMS',
      },
      {
        questionnaireName: 'FRS2408B',
        numberOfCases: 0,
        fieldPeriod: 'August 2024',
        surveyTla: 'FRS',
      },
      {
        questionnaireName: 'FRS2408B_EDIT',
        numberOfCases: 0,
        fieldPeriod: 'August 2024',
        surveyTla: 'FRS',
      },
      {
        questionnaireName: 'FRS2504A',
        numberOfCases: 1,
        fieldPeriod: 'April 2025',
        surveyTla: 'FRS',
      },
      {
        questionnaireName: 'FRS2504A_EDIT',
        numberOfCases: 1,
        fieldPeriod: 'April 2025',
        surveyTla: 'FRS',
      },
      {
        questionnaireName: 'OPN2201A',
        numberOfCases: 3,
        fieldPeriod: 'January 2022',
        surveyTla: 'OPN',
      },
      {
        questionnaireName: 'OPN2201A_EDIT',
        numberOfCases: 3,
        fieldPeriod: 'January 2022',
        surveyTla: 'OPN',
      },
    ];

    const expectedSurveyListMockObject: Survey[] = [
      {
        name: 'FRS',
        questionnaires: [{
          questionnaireName: 'FRS2408B',
          numberOfCases: 0,
          fieldPeriod: 'August 2024',
          surveyTla: 'FRS',
        },
        {
          questionnaireName: 'FRS2504A',
          numberOfCases: 1,
          fieldPeriod: 'April 2025',
          surveyTla: 'FRS',
        },
        ],
      },
    ];

    blaiseApiMock.setup((api) => api.getQuestionnaires()).returns(async () => questionnaireDetailsListMockObject);

    // act
    const response: Response = await sut.get(`/api/surveys?userRole=${userRole}`);

    // assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(expectedSurveyListMockObject);
    blaiseApiMock.verify((api) => api.getQuestionnaires(), Times.once());
  });

  it('should log the number of questionnaires and filtered questionnaires for the Survey Support Role', async () => {
    // arrange
    const userRole = 'Survey Support';

    // mock blaise client to return a list of questionnaires with allocation

    const questionnaireDetailsListMockObject: QuestionnaireDetails[] = [
      {
        questionnaireName: 'LMS2101_AA1',
        numberOfCases: 3,
        fieldPeriod: 'January 2021',
        surveyTla: 'LMS',
      },
      {
        questionnaireName: 'LMS2101_AA1_EDIT',
        numberOfCases: 3,
        fieldPeriod: 'January 2021',
        surveyTla: 'LMS',
      },
      {
        questionnaireName: 'FRS2408B',
        numberOfCases: 0,
        fieldPeriod: 'August 2024',
        surveyTla: 'FRS',
      },
      {
        questionnaireName: 'FRS2408B_EDIT',
        numberOfCases: 0,
        fieldPeriod: 'August 2024',
        surveyTla: 'FRS',
      },
      {
        questionnaireName: 'FRS2504A',
        numberOfCases: 1,
        fieldPeriod: 'April 2025',
        surveyTla: 'FRS',
      },
      {
        questionnaireName: 'FRS2504A_EDIT',
        numberOfCases: 1,
        fieldPeriod: 'April 2025',
        surveyTla: 'FRS',
      },
      {
        questionnaireName: 'OPN2201A',
        numberOfCases: 3,
        fieldPeriod: 'January 2022',
        surveyTla: 'OPN',
      },
      {
        questionnaireName: 'OPN2201A_EDIT',
        numberOfCases: 3,
        fieldPeriod: 'January 2022',
        surveyTla: 'OPN',
      },
    ];

    const expectedFilteredQuestionnaireListMockObject: QuestionnaireDetails[] = [
      {
        questionnaireName: 'FRS2408B',
        numberOfCases: 0,
        fieldPeriod: 'August 2024',
        surveyTla: 'FRS',
      },
      {
        questionnaireName: 'FRS2504A',
        numberOfCases: 1,
        fieldPeriod: 'April 2025',
        surveyTla: 'FRS',
      },
    ];

    blaiseApiMock.setup((api) => api.getQuestionnaires()).returns(async () => questionnaireDetailsListMockObject);

    // act
    await sut.get(`/api/surveys?userRole=${userRole}`);

    // assert
    cloudLoggerMock.verify((logger) => logger.info(`Retrieved ${questionnaireDetailsListMockObject.length} questionnaire(s)`), Times.once());
    cloudLoggerMock.verify((logger) => logger.info(`Filtered down to ${expectedFilteredQuestionnaireListMockObject.length} questionnaire(s), role: ${userRole}`), Times.once());
  });

  it('It should return a 500 response when a call is made to retrieve a list of surveys and the rest api is not availiable', async () => {
    // arrange
    const axiosError = createAxiosError(500);
    const userRole = 'SVT Editor';

    blaiseApiMock.setup((api) => api.getQuestionnaires()).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.get(`/api/surveys?userRole=${userRole}`);

    // assert
    expect(response.status).toEqual(500);
  });

  it('It should log a 500 response error when a call is made to retrieve a list of surveys and the rest api is not availiable', async () => {
    // arrange
    const axiosError = createAxiosError(500);
    const userRole = 'SVT Editor';

    blaiseApiMock.setup((api) => api.getQuestionnaires()).returns(() => Promise.reject(axiosError));

    // act
    await sut.get(`/api/surveys?userRole=${userRole}`);

    // assert
    cloudLoggerMock.verify((logger) => logger.error(`Failed to get questionnaires, role: ${userRole} with 500 ${axiosError}`), Times.once());
  });

  it('It should return a 500 response when the api client throws an error', async () => {
    // arrange
    const apiClientError = new Error();
    const userRole = 'SVT Editor';

    blaiseApiMock.setup((api) => api.getQuestionnaires()).returns(() => Promise.reject(apiClientError));

    // act
    const response: Response = await sut.get(`/api/surveys?userRole=${userRole}`);

    // assert
    expect(response.status).toEqual(500);
  });

  it('It should log a 500 response erro when the api client throws an error', async () => {
    // arrange
    const apiClientError = new Error();
    const userRole = 'SVT Editor';

    blaiseApiMock.setup((api) => api.getQuestionnaires()).returns(() => Promise.reject(apiClientError));

    // act
    await sut.get(`/api/surveys?userRole=${userRole}`);

    // assert
    cloudLoggerMock.verify((logger) => logger.error(`Failed to get questionnaires, role: ${userRole} with 500 ${apiClientError}`), Times.once());
  });

  it('It should return a 404 response when a call is made to retrieve a list of surveys and the client returns a 404 not found', async () => {
    // arrange
    const axiosError = createAxiosError(404);
    const userRole = 'SVT Editor';

    blaiseApiMock.setup((api) => api.getQuestionnaires()).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.get(`/api/surveys?userRole=${userRole}`);

    // assert
    expect(response.status).toEqual(404);
  });

  it('It should log a 404 response error when a call is made to retrieve a list of surveys and the client returns a 404 not found', async () => {
    // arrange
    const axiosError = createAxiosError(404);
    const userRole = 'SVT Editor';

    blaiseApiMock.setup((api) => api.getQuestionnaires()).returns(() => Promise.reject(axiosError));

    // act
    await sut.get(`/api/surveys?userRole=${userRole}`);

    // assert
    cloudLoggerMock.verify((logger) => logger.error(`Failed to get questionnaires, role: ${userRole} with 404 ${axiosError}`), Times.once());
  });
});
