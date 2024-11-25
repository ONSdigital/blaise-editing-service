import supertest, { Response } from 'supertest';
import { IMock, Mock, Times } from 'typemoq';
import { Auth } from 'blaise-login-react-server';
import nodeServer from '../../../server/server';
import createAxiosError from './axiosTestHelper';
import BlaiseApi from '../../../server/api/BlaiseApi';
import FakeServerConfigurationProvider from '../configuration/FakeServerConfigurationProvider';
import { QuestionnaireDetails, Survey } from '../../../common/interfaces/surveyInterface';

// create fake config
const configFake = new FakeServerConfigurationProvider();

// mock auth
Auth.prototype.ValidateToken = jest.fn().mockReturnValue(true);

// mock blaise api client
const blaiseApiMock: IMock<BlaiseApi> = Mock.ofType(BlaiseApi);

// need to test the endpoints through the express server
const server = nodeServer(configFake, blaiseApiMock.object);

// supertest will handle all http calls
const sut = supertest(server);

describe('Get surveys tests', () => {
  beforeEach(() => {
    blaiseApiMock.reset();
  });

  afterAll(() => {
    blaiseApiMock.reset();
  });

  it.each(['SVT_Supervisor', 'SVT_Editor'])('should return a 200 response with an expected list of surveys for the SVT Roles', async (userRole) => {
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

  it('should return a 200 response with an expected list of surveys for the FRS Research Role', async () => {
    // arrange
    const userRole = 'FRS_Research';

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

  it('should return a 200 response with an expected list of surveys for the Survey Support Role', async () => {
    // arrange
    const userRole = 'Survey_Support';

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

  it('It should return a 500 response when a call is made to retrieve a list of surveys and the rest api is not availiable', async () => {
    // arrange
    const axiosError = createAxiosError(500);
    const userRole = 'SVT_Editor';

    blaiseApiMock.setup((api) => api.getQuestionnaires()).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.get(`/api/surveys?userRole=${userRole}`);

    // assert
    expect(response.status).toEqual(500);
  });

  it('It should return a 500 response when the api client throws an error', async () => {
    // arrange
    const apiClientError = new Error();
    const userRole = 'SVT_Editor';

    blaiseApiMock.setup((api) => api.getQuestionnaires()).returns(() => Promise.reject(apiClientError));

    // act
    const response: Response = await sut.get(`/api/surveys?userRole=${userRole}`);

    // assert
    expect(response.status).toEqual(500);
  });

  it('It should return a 404 response when a call is made to retrieve a list of surveys and the client returns a 404 not found', async () => {
    // arrange
    const axiosError = createAxiosError(404);
    const userRole = 'SVT_Editor';

    blaiseApiMock.setup((api) => api.getQuestionnaires()).returns(() => Promise.reject(axiosError));

    // act
    const response: Response = await sut.get(`/api/surveys?userRole=${userRole}`);

    // assert
    expect(response.status).toEqual(404);
  });
});
