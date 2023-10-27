import { render, act, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import surveyListMockObject from '../../mockObjects/surveyListMockObject';
import userMockObject from '../../mockObjects/userMockObject';
import { getSurveys } from '../../../client/Common/api/NodeApi';
import { Survey } from '../../../common/interfaces/surveyInterface';
import ManagerHome from '../../../client/Manager/Pages/ManagerHome';

// set global vars
const userRole:string = 'Manager';
let view:RenderResult;

// set mocks
jest.mock('../../../client/Common/api/NodeApi');
const getSurveysMock = getSurveys as jest.Mock<Promise<Survey[]>>;

describe('Given there are surveys available in blaise', () => {
  beforeEach(() => {
    getSurveysMock.mockImplementation(() => Promise.resolve(surveyListMockObject));
  });

  afterEach(() => {
    getSurveysMock.mockReset();
  });

  it('should render the manager page correctly when surveys are returned', async () => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <ManagerHome user={user} />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot();
  });

  it('should display a list of the expected surveys', async () => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <ManagerHome user={user} />
        </BrowserRouter>,
      );
    });

    // assert
    surveyListMockObject.forEach((survey, surveyIndex) => {
      const surveyListView = view.getByTestId(`accordion-${surveyIndex}-heading`);
      expect(surveyListView).toHaveTextContent(survey.name);

      survey.questionnaires.forEach(({ questionnaireName, numberOfCases }) => {
        const questionnaireListView = view.getByTestId(`accordion-${surveyIndex}-content`);
        expect(questionnaireListView).toHaveTextContent(questionnaireName);
        expect(questionnaireListView).toHaveTextContent(String(numberOfCases));
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

  it('should render the page correctly when no surveys are returned', async () => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <ManagerHome user={user} />
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
          <ManagerHome user={user} />
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
          <ManagerHome user={user} />
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
          <ManagerHome user={user} />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot();
  });
});
