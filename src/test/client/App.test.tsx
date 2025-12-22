import {
  describe, it, expect, beforeEach, afterEach, vi, type Mock
} from 'vitest';
import {
  render, screen
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { getEditorInformation, getSupervisorEditorInformation, getSurveys } from '../../client/api/NodeApi';
import userMockObject from '../server/mockObjects/userMockObject';
import App from '../../client/App';
import { SupervisorInformationMockObject1 } from './MockObjects/SupervisorMockObjects';
import FilteredSurveyListMockObject from './MockObjects/SurveyMockObjects';
import { EditorInformationMockObject1 } from './MockObjects/EditorMockObjects';

const validUserRoles: string[] = ['SVT Supervisor', 'SVT Editor'];

vi.mock('blaise-login-react/blaise-login-react-client', async () => {
  const actual = await vi.importActual<typeof import('blaise-login-react/blaise-login-react-client')>('blaise-login-react/blaise-login-react-client');
  return {
    ...actual,
    Authenticate: actual.MockAuthenticate
  };
});

const { MockAuthenticate } = await vi.importActual<typeof import('blaise-login-react/blaise-login-react-client')>('blaise-login-react/blaise-login-react-client');

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