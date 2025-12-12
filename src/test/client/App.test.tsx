import {
  describe, it, expect, beforeEach, afterEach, vi, type Mock
} from 'vitest';
import {
  RenderResult, render, screen // Removed act, added screen
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// We don't import Authenticate here anymore because we are mocking the module below
import { getEditorInformation, getSupervisorEditorInformation, getSurveys } from '../../client/api/NodeApi';
import { Survey } from '../../common/interfaces/surveyInterface';
import userMockObject from '../server/mockObjects/userMockObject';
import App from '../../client/App';
import { SupervisorInformationMockObject1, SupervisorInformationMockObject2 } from './MockObjects/SupervisorMockObjects';
import { EditorInformation } from '../../client/Interfaces/editorInterface';
import { SupervisorInformation } from '../../client/Interfaces/supervisorInterface';
import FilteredSurveyListMockObject from './MockObjects/SurveyMockObjects';
import { EditorInformationMockObject1, EditorInformationMockObject2 } from './MockObjects/EditorMockObjects';

// set global variables
const validUserRoles: string[] = ['SVT Supervisor', 'SVT Editor'];

// --- FIX STARTS HERE ---
// 1. Define the mock factory to explicitly swap 'Authenticate' with 'MockAuthenticate'
vi.mock('blaise-login-react/blaise-login-react-client', async () => {
  const actual = await vi.importActual<any>('blaise-login-react/blaise-login-react-client');
  return {
    ...actual,
    // This tells App.tsx: "When you import Authenticate, use this Mock class instead"
    Authenticate: actual.MockAuthenticate
  };
});

// 2. Import MockAuthenticate to control it in our tests
//    (We use importActual to get access to the helper methods like OverrideReturnValues)
const { MockAuthenticate } = await vi.importActual<any>('blaise-login-react/blaise-login-react-client');

// 3. REMOVED the fragile prototype patching:
// Authenticate.prototype.render = MockAuthenticate.prototype.render; (DELETED)

// --- FIX ENDS HERE ---

vi.mock('../../client/api/NodeApi');
const getSurveysMock = getSurveys as Mock;
const getEditorInformationMock = getEditorInformation as Mock;
const getSupervisorEditorInformationMock = getSupervisorEditorInformation as Mock;

describe('Renders the correct screen depending if the user has recently logged in', () => {
  beforeEach(() => {
    getSurveysMock.mockResolvedValue(FilteredSurveyListMockObject);
    getEditorInformationMock.mockResolvedValue(EditorInformationMockObject1);
    getSupervisorEditorInformationMock.mockResolvedValue(SupervisorInformationMockObject1);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Should display a message asking the user to enter their Blaise user credentials if they are not logged in', async () => {
    // arrange
    const user = userMockObject;
    MockAuthenticate.OverrideReturnValues(user, false);

    // act
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );

    // assert
    // Keep findByTestId to be safe
    const appView = await screen.findByTestId('login-page');
    expect(appView).toHaveTextContent('Enter your Blaise username and password');
  });

  it.each(validUserRoles)('Should display the surveys page if the user is already logged in', async (userRole) => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    MockAuthenticate.OverrideReturnValues(user, true);

    // act
    render(<BrowserRouter><App /></BrowserRouter>);

    // assert
    const appView = await screen.findByTestId('app-content');
    expect(appView).toHaveTextContent('Select questionnaire');
  });
});