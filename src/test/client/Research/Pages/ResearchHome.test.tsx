import {
  act, fireEvent, render, RenderResult, screen,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CaseEditInformation } from 'blaise-api-node-client';
import Organisation from 'blaise-api-node-client/lib/cjs/enums/organisation';
import UserRole from '../../../../client/Common/enums/UserTypes';
import { getCaseSearchResults, getSurveys } from '../../../../client/api/NodeApi';
import { Survey } from '../../../../common/interfaces/surveyInterface';
import FilteredSurveyListMockObject from '../../MockObjects/SurveyMockObjects';
import userMockObject from '../../../server/mockObjects/userMockObject';
import ResearchHome from '../../../../client/Research/Pages/ResearchHome';
import { CaseEditInformationListMockObject } from '../../../server/mockObjects/CaseMockObject';

// set global vars
const userRole:string = UserRole.FRS_Researcher;
let view:RenderResult;

// set mocks
vi.mock('../../../../client/api/NodeApi', async () => {
  const actual = await vi.importActual<typeof import('../../../../client/api/NodeApi')>(
    '../../../../client/api/NodeApi');

  return {
    ...actual,
    getSurveys: vi.fn(() => Promise.resolve([])),
    getCaseSearchResults: vi.fn(() => Promise.resolve({
      info: 'mock info',
      timestamp: '2024-01-01T00:00:00Z',
    })),
  };
});
const getSurveysMock = getSurveys as vi.mock<Promise<Survey[]>>;
const getCaseInformationMock = getCaseSearchResults as vi.mock<Promise<CaseEditInformation[]>>;

describe('Given there are surveys available in blaise', () => {
  beforeEach(() => {
    getSurveysMock.mockImplementation(() => Promise.resolve(FilteredSurveyListMockObject));
    getCaseInformationMock.mockImplementation(() => Promise.resolve(CaseEditInformationListMockObject));
  });

  it('should render the Research page correctly when surveys are returned', async () => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <ResearchHome user={user} />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot(
      'ResearchPageSurveysReturned',
    );
  });

  it('should display the expected questionnaire details for the default option', async () => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <ResearchHome user={user} />
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

      const questionnaireView = view.getByTestId(`${defaultQuestionnaireName}-Research-Content`);
      expect(questionnaireView).toHaveTextContent(String(defaultQuestionnaire.fieldPeriod));
      expect(questionnaireView).toHaveTextContent(String(defaultQuestionnaire.numberOfCases));
    });
  });

  it('should render the Research page correctly and Search button disabled because search text not entered', async () => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    await act(async () => {
      view = render(
        <BrowserRouter>
          <ResearchHome user={user} />
        </BrowserRouter>,
      );
    });

    // act
    // Don't do anything to check if the button is disabled

    // assert
    expect(view).toMatchSnapshot(
      'ResearchPageSurveysReturnedSearchInitial',
    );
  });

  it('should render the Research page correctly and Search button enabled after search text entered', async () => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    await act(async () => {
      view = render(
        <BrowserRouter>
          <ResearchHome user={user} />
        </BrowserRouter>,
      );
    });

    // act
    await act(async () => {
      fireEvent.change(view.getByTestId('text-input'), { target: { value: '900' } });
    });

    // assert
    expect(view).toMatchSnapshot(
      'ResearchPageSurveysReturnedSearchTextEntered',
    );
  });

  it('should render the Research page correctly when surveys are returned and search used', async () => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    await act(async () => {
      view = render(
        <BrowserRouter>
          <ResearchHome user={user} />
        </BrowserRouter>,
      );
    });

    // act
    await act(async () => {
      fireEvent.change(view.getByTestId('text-input'), { target: { value: '900' } });
      fireEvent.click(view.getByText('Search'));
    });

    // assert
    expect(view).toMatchSnapshot(
      'ResearchPageSurveysReturnedSearchUsed',
    );
  });

  it('should display the expected questionnaire and case details when search used', async () => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    await act(async () => {
      view = render(
        <BrowserRouter>
          <ResearchHome user={user} />
        </BrowserRouter>,
      );
    });

    // act
    await act(async () => {
      fireEvent.change(view.getByTestId('text-input'), { target: { value: '900' } });
      fireEvent.click(view.getByText('Search'));
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

      const questionnaireView = view.getByTestId(`${defaultQuestionnaireName}-Research-Content`);
      expect(questionnaireView).toHaveTextContent(String(defaultQuestionnaire.fieldPeriod));
      expect(questionnaireView).toHaveTextContent(String(defaultQuestionnaire.numberOfCases));

      const caseIdRows = view.getAllByLabelText(`${defaultQuestionnaireName}-CaseID`);
      const outcomeRows = view.getAllByLabelText(`${defaultQuestionnaireName}-Outcome`);
      const interviewerRows = view.getAllByLabelText(`${defaultQuestionnaireName}-Interviewer`);
      const organisationRows = view.getAllByLabelText(`${defaultQuestionnaireName}-Organisation`);
      const linksRows = view.getAllByLabelText(`${defaultQuestionnaireName}-Links`);

      CaseEditInformationListMockObject.forEach((caseDetails, index) => {
        expect(caseIdRows[index]).toHaveTextContent(caseDetails.primaryKey);
        expect(outcomeRows[index]).toHaveTextContent(caseDetails.outcome.toString());
        expect(interviewerRows[index]).toHaveTextContent(caseDetails.interviewer);
        expect(organisationRows[index]).toHaveTextContent(Organisation[caseDetails.organisation]?.toString() ?? '');
        expect(linksRows[index]).toHaveTextContent('Edit case | View case');
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
          <ResearchHome user={user} />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot(
      'ResearchPageNoSurveysReturned',
    );
  });

  it('should display a message telling the user there are no surveys', async () => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <ResearchHome user={user} />
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
          <ResearchHome user={user} />
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
          <ResearchHome user={user} />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot(
      'ResearchPageError',
    );
  });
});

describe('Given there is an error that triggered a catch all 404 or 500 response', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        search: '?error=Something%20went%20wrong',
      },
      writable: true,
    });
  });

  it('an error message will be displayed with the parameters contents', async () => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    // act
    render(<ResearchHome user={user} />);

    // assert
    expect(await screen.findByTestId('ErrorMessage')).toHaveTextContent('Something went wrong');
  });
});
