import {
  render, act, RenderResult, screen,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userMockObject from '../../../server/mockObjects/userMockObject';
import { getEditorInformation, getSurveys } from '../../../../client/api/NodeApi';
import { Survey } from '../../../../common/interfaces/surveyInterface';
import EditorHome from '../../../../client/Editor/Pages/EditorHome';
import { EditorInformation } from '../../../../client/Interfaces/editorInterface';
import FilteredSurveyListMockObject from '../../MockObjects/SurveyMockObjects';
import { EditorInformationMockObject1, EditorInformationMockObject2 } from '../../MockObjects/EditorMockObjects';
import UserRole from '../../../../client/Common/enums/UserTypes';

// set global vars
const userRole:string = UserRole.SVT_Editor;
let view:RenderResult;

// set mocks
vi.mock('../../../../client/api/NodeApi', async () => {
  const actual = await vi.importActual<typeof import('../../../../client/api/NodeApi')>(
    '../../../../client/api/NodeApi');

  return {
    ...actual,
    getSurveys: vi.fn(() => Promise.resolve([])),
    getEditorInformation: vi.fn(() => Promise.resolve({
      info: 'mock info',
      timestamp: '2024-01-01T00:00:00Z',
    })),
  };
});
const getSurveysMock = getSurveys as vi.mock<Promise<Survey[]>>;
const getEditorInformationMock = getEditorInformation as vi.mock<Promise<EditorInformation>>;

describe('Given there are surveys available in blaise', () => {
  beforeEach(() => {
    getSurveysMock.mockImplementation(() => Promise.resolve(FilteredSurveyListMockObject));
    getEditorInformationMock.mockReturnValueOnce(Promise.resolve(EditorInformationMockObject1))
      .mockReturnValueOnce(Promise.resolve(EditorInformationMockObject2));
  });

  afterEach(() => {
    getSurveysMock.mockReset();
    getEditorInformationMock.mockReset();
  });

  it('should render the editor page correctly when surveys are returned', async () => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditorHome user={user} />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot(
      'EditPageSurveysReturned',
    );
  });

  it('should display a list of the expected surveys', async () => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditorHome user={user} />
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

      expect(questionnaireListView).toHaveTextContent(defaultQuestionnaire.questionnaireName.replace('_EDIT', ''));

      const questionnaireView = view.getByTestId(`${defaultQuestionnaire.questionnaireName}-editorContent`);
      expect(questionnaireView).toHaveTextContent(String(defaultQuestionnaire.fieldPeriod));
      expect(questionnaireView).toHaveTextContent(String(defaultQuestionnaire.numberOfCases));

      const caseRows = view.getAllByLabelText(`${defaultQuestionnaire.questionnaireName}-CaseID`);
      const editStatusRows = view.getAllByLabelText(`${defaultQuestionnaire.questionnaireName}-EditStatus`);

      EditorInformationMockObject1.Cases.forEach((caseDetails, caseIndex) => {
        expect(caseRows[caseIndex]).toHaveTextContent(caseDetails.CaseId);
        expect(editStatusRows[caseIndex]).toHaveTextContent(String(caseDetails.EditStatus));
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
          <EditorHome user={user} />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot(
      'EditPageNoSurveysReturned',
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
          <EditorHome user={user} />
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
          <EditorHome user={user} />
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
          <EditorHome user={user} />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot(
      'EditorPageError',
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
    render(<EditorHome user={user} />);

    // assert
    expect(await screen.findByTestId('ErrorMessage')).toHaveTextContent('Something went wrong');
  });
});
