import { render, act, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import surveyListMockObject from '../../mockObjects/surveyListMockObject';
import Surveys from '../../../client/pages/Surveys';
import userMockObject from '../../mockObjects/userMockObject';
import { getSurveys } from '../../../client/clients/NodeApi';
import { Survey } from '../../../common/interfaces/surveyInterface';

// set global vars
const validUserRoles:string[] = ['Manager', 'Editor'];
let view:RenderResult;

// set mocks
jest.mock('../../../client/clients/NodeApi');
const getSurveysMock = getSurveys as jest.Mock<Promise<Survey[]>>;

describe('Given there are surveys available in blaise', () => {
  beforeEach(() => {
    getSurveysMock.mockImplementation(() => Promise.resolve(surveyListMockObject));
  });

  afterEach(() => {
    getSurveysMock.mockReset();
  });

  it.each(validUserRoles)('should render the manager page correctly when surveys are returned', async (userRole) => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Surveys user={user} />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot();
  });

  it.each(validUserRoles)('should display a list of the expected surveys', async (userRole) => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Surveys user={user} />
        </BrowserRouter>,
      );
    });

    // assert
    surveyListMockObject.forEach((survey, surveyIndex) => {
      const surveyListView = view.getByTestId(`accordion-${surveyIndex}-heading`);
      expect(surveyListView).toHaveTextContent(survey.name);

      survey.questionnaires.forEach(({ name, dataRecordCount }) => {
        const questionnaireListView = view.getByTestId(`accordion-${surveyIndex}-content`);
        expect(questionnaireListView).toHaveTextContent(name);
        expect(questionnaireListView).toHaveTextContent(String(dataRecordCount));
      });
    });
  });
});

describe('Given there are no surveys available in blaise', () => {
  beforeEach(() => {
    getSurveysMock.mockImplementation(() => Promise.resolve([]));
  });

  afterEach(() => {
    getSurveysMock.mockReset();
  });

  it.each(validUserRoles)('should render the page correctly when no surveys are returned', async (userRole) => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Surveys user={user} />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot();
  });

  it.each(validUserRoles)('should display a message telling the user there are no surveys', async (userRole) => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Surveys user={user} />
        </BrowserRouter>,
      );
    });

    // assert
    const surveysView = view.getByTestId('Surveys');
    expect(surveysView).toHaveTextContent('There are no surveys available');
  });
});

describe('Given there the blaise rest api is not available', () => {
  beforeEach(() => {
    getSurveysMock.mockRejectedValue(new Error('try again in a few minutes'));
  });

  afterEach(() => {
    getSurveysMock.mockReset();
  });

  it.each(validUserRoles)('should display an error message telling the user to try again in a few minutes', async (userRole) => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Surveys user={user} />
        </BrowserRouter>,
      );
    });

    // assert
    const surveysView = view.getByTestId('Surveys');
    expect(surveysView).toHaveTextContent('try again in a few minutes');
  });

  it.each(validUserRoles)('should render the page correctly for the user when an error occurs', async (userRole) => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Surveys user={user} />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot();
  });
});
