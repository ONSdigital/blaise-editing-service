import { act, render, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserRole from '../../../../client/Common/enums/UserTypes';
import { getSurveys } from '../../../../client/api/NodeApi';
import { Survey } from '../../../../common/interfaces/surveyInterface';
import FilteredSurveyListMockObject from '../../MockObjects/SurveyMockObjects';
import userMockObject from '../../../server/mockObjects/userMockObject';
import SupportHome from '../../../../client/Support/Pages/SupportHome';

// set global vars
const userRole:string = UserRole.Survey_Support;
let view:RenderResult;

// set mocks
jest.mock('../../../../client/api/NodeApi');
const getSurveysMock = getSurveys as jest.Mock<Promise<Survey[]>>;

describe('Given there are surveys available in blaise', () => {
  beforeEach(() => {
    getSurveysMock.mockImplementation(() => Promise.resolve(FilteredSurveyListMockObject));
  });

  it('should render the Research page correctly when surveys are returned', async () => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <SupportHome user={user} />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot();
  });

  it('should display the expected questionnaire details for the default option', async () => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <SupportHome user={user} />
        </BrowserRouter>,
      );
    });
    // assert
    FilteredSurveyListMockObject.forEach((survey, surveyIndex) => {
      const surveyListView = view.getByTestId(`survey-accordion-${surveyIndex}-heading`);
      expect(surveyListView).toHaveTextContent(survey.name);

      const questionnaireListView = view.getByTestId(`survey-accordion-${surveyIndex}-content`);

      const defaultQuestionnaire = survey.questionnaires[0];
      if (defaultQuestionnaire === undefined) {
        throw Error('No default questionnaire found');
      }

      const defaultQuestionnaireName = defaultQuestionnaire.questionnaireName;

      expect(questionnaireListView).toHaveTextContent(defaultQuestionnaire.questionnaireName.replace('_EDIT', ''));

      const questionnaireView = view.getByTestId(`${defaultQuestionnaireName}-Support-Content`);
      expect(questionnaireView).toHaveTextContent(String(defaultQuestionnaire.fieldPeriod));
      expect(questionnaireView).toHaveTextContent(String(defaultQuestionnaire.numberOfCases));
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

  it('should render the page correctly when no surveys are returned', async () => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <SupportHome user={user} />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot();
  });

  it('should display a message telling the user there are no surveys', async () => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <SupportHome user={user} />
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

  it('should display an error message telling the user to try again in a few minutes', async () => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <SupportHome user={user} />
        </BrowserRouter>,
      );
    });

    // assert
    const surveysView = view.getByTestId('Surveys');
    expect(surveysView).toHaveTextContent('try again in a few minutes');
  });

  it('should render the page correctly for the user when an error occurs', async () => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <SupportHome user={user} />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot();
  });
});
