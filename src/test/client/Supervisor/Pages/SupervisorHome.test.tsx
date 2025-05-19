import {
  render, act, RenderResult, fireEvent, screen,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CaseEditInformation } from 'blaise-api-node-client';
import Organisation from 'blaise-api-node-client/lib/cjs/enums/organisation';
import userMockObject from '../../../server/mockObjects/userMockObject';
import { getCaseSearchResults, getSupervisorEditorInformation, getSurveys } from '../../../../client/api/NodeApi';
import { Survey } from '../../../../common/interfaces/surveyInterface';
import SupervisorHome from '../../../../client/Supervisor/Pages/SupervisorHome';
import { SupervisorInformation } from '../../../../client/Interfaces/supervisorInterface';
import UserRole from '../../../../client/Common/enums/UserTypes';
import FilteredSurveyListMockObject from '../../MockObjects/SurveyMockObjects';
import { SupervisorInformationMockObject1, SupervisorInformationMockObject2 } from '../../MockObjects/SupervisorMockObjects';
import { CaseEditInformationListMockObject } from '../../../server/mockObjects/CaseMockObject';
import CaseSearchForm from '../../../../client/Common/components/CaseSearchForm';

// set global vars
const userRole:string = UserRole.SVT_Supervisor;
let view:RenderResult;

// set mocks
vi.mock('../../../../client/api/NodeApi', async () => {
  const actual = await vi.importActual<typeof import('../../../../client/api/NodeApi')>(
    '../../../../client/api/NodeApi');

  return {
    ...actual,
    getSurveys: vi.fn(() => Promise.resolve([])),
    getSupervisorEditorInformation: vi.fn(() => Promise.resolve({
      info: 'mock info',
      timestamp: '2024-01-01T00:00:00Z',
    })),
    getCaseSearchResults: vi.fn(() => Promise.resolve({
      info: 'mock info',
      timestamp: '2024-01-01T00:00:00Z',
    })),
  };
});
const getSurveysMock = getSurveys as vi.mock<Promise<Survey[]>>;
const getSupervisorCaseInformationMock = getSupervisorEditorInformation as vi.mock<Promise<SupervisorInformation>>;
const getCaseInformationMock = getCaseSearchResults as vi.mock<Promise<CaseEditInformation[]>>;

describe('Given there are surveys available in blaise', () => {
  beforeEach(() => {
    getSurveysMock.mockImplementation(() => Promise.resolve(FilteredSurveyListMockObject));
    getSupervisorCaseInformationMock.mockReturnValueOnce(Promise.resolve(SupervisorInformationMockObject1))
      .mockReturnValueOnce(Promise.resolve(SupervisorInformationMockObject2));
  });

  afterEach(() => {
    getSurveysMock.mockReset();
    getSupervisorCaseInformationMock.mockReset();
  });

  it('should render the supervisor page correctly when surveys are returned', async () => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <SupervisorHome user={user} />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot(
      'SupervisorPageSurveysReturned',
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
          <SupervisorHome user={user} />
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

      const questionnaireView = view.getByTestId(`${defaultQuestionnaireName}-supervisor-Content`);
      expect(questionnaireView).toHaveTextContent(String(SupervisorInformationMockObject1.TotalNumberOfCases));
      expect(questionnaireView).toHaveTextContent(String(SupervisorInformationMockObject1.NumberOfCasesNotAllocated));
      expect(questionnaireView).toHaveTextContent(String(SupervisorInformationMockObject1.NumberOfCasesAllocated));
      expect(questionnaireView).toHaveTextContent(String(SupervisorInformationMockObject1.NumberOfCasesCompleted));

      const editorRows = view.getAllByLabelText(`${defaultQuestionnaireName}-Editor`);
      const numberOfCasesAllocatedRows = view.getAllByLabelText(`${defaultQuestionnaireName}-NumberOfCasesAllocated`);
      const numberOfCasesCompleted = view.getAllByLabelText(`${defaultQuestionnaireName}-NumberOfCasesCompleted`);
      const numberOfCasesQueried = view.getAllByLabelText(`${defaultQuestionnaireName}-NumberOfCasesQueried`);

      SupervisorInformationMockObject1.EditorInformation.forEach((editor, index) => {
        expect(editorRows[index]).toHaveTextContent(editor.EditorName);
        expect(numberOfCasesAllocatedRows[index]).toHaveTextContent(String(editor.NumberOfCasesAllocated));
        expect(numberOfCasesCompleted[index]).toHaveTextContent(String(editor.NumberOfCasesCompleted));
        expect(numberOfCasesQueried[index]).toHaveTextContent(String(editor.NumberOfCasesQueried));
      });
    });
  });
});

describe('Given that search is clicked', () => {
  beforeEach(() => {
    getCaseInformationMock.mockImplementation(() => Promise.resolve(CaseEditInformationListMockObject));
  });

  it('should render the search page correctly', async () => {
    // arrange
    const questionnaireName = 'FRS2504A';

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <CaseSearchForm questionnaireName={questionnaireName} userRole={UserRole.SVT_Supervisor} />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot(
      'SupervisorSerachPage',
    );
  });

  it('should render the search page correctly when cases are searched for', async () => {
    // arrange
    const questionnaireName = 'FRS2504A';
    await act(async () => {
      view = render(
        <BrowserRouter>
          <CaseSearchForm questionnaireName={questionnaireName} userRole={UserRole.SVT_Supervisor} />
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
      'SupervisorSerachPageSearchUSed',
    );
  });

  it('should display the expected case details when cases are searched for', async () => {
    // arrange
    const questionnaireName = 'FRS2504A';
    await act(async () => {
      view = render(
        <BrowserRouter>
          <CaseSearchForm questionnaireName={questionnaireName} userRole={UserRole.SVT_Supervisor} />
        </BrowserRouter>,
      );
    });

    // act
    await act(async () => {
      fireEvent.change(view.getByTestId('text-input'), { target: { value: '900' } });
      fireEvent.click(view.getByText('Search'));
    });

    // assert

    const caseIdRows = view.getAllByLabelText(`${questionnaireName}-CaseID`);
    const outcomeRows = view.getAllByLabelText(`${questionnaireName}-Outcome`);
    const interviewerRows = view.getAllByLabelText(`${questionnaireName}-Interviewer`);
    const organisationRows = view.getAllByLabelText(`${questionnaireName}-Organisation`);
    const linksRows = view.getAllByLabelText(`${questionnaireName}-Links`);

    CaseEditInformationListMockObject.forEach((caseDetails, index) => {
      expect(caseIdRows[index]).toHaveTextContent(caseDetails.primaryKey);
      expect(outcomeRows[index]).toHaveTextContent(caseDetails.outcome.toString());
      expect(interviewerRows[index]).toHaveTextContent(caseDetails.interviewer);
      expect(organisationRows[index]).toHaveTextContent(Organisation[caseDetails.organisation]?.toString() ?? '');
      expect(linksRows[index]).toHaveTextContent('Edit case | View case');
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
          <SupervisorHome user={user} />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot(
      'SupervisorPageNoSurveysReturned',
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
          <SupervisorHome user={user} />
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
          <SupervisorHome user={user} />
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
          <SupervisorHome user={user} />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot(
      'SupervisorPageError',
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
    render(<SupervisorHome user={user} />);

    // assert
    expect(await screen.findByTestId('ErrorMessage')).toHaveTextContent('Something went wrong');
  });
});
