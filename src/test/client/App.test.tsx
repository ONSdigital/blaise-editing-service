import {
  describe, it, expect, beforeEach, afterEach,
} from 'vitest';
import {
  RenderResult, act, render,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Authenticate } from 'blaise-login-react-client';
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
const validUserRoles:string[] = ['SVT Supervisor', 'SVT Editor'];
let view:RenderResult;

// create mocks
vi.mock('blaise-login-react-client');
const { MockAuthenticate } = await vi.importActual('blaise-login-react-client');
Authenticate.prototype.render = MockAuthenticate.prototype.render;

if (!MockAuthenticate || typeof MockAuthenticate.OverrideReturnValues !== 'function') {
  throw new Error('MockAuthenticate import failed or has unexpected structure');
}

vi.mock('../../client/api/NodeApi');
const getSurveysMock = getSurveys as vi.mock<Promise<Survey[]>>;
const getEditorInformationMock = getEditorInformation as vi.mock<Promise<EditorInformation>>;
const getSupervisorEditorInformationMock = getSupervisorEditorInformation as vi.mock<Promise<SupervisorInformation>>;

describe('Renders the correct screen depending if the user has recently logged in', () => {
  beforeEach(() => {
    getSurveysMock.mockImplementation(() => Promise.resolve(FilteredSurveyListMockObject));
    getEditorInformationMock.mockReturnValueOnce(Promise.resolve(EditorInformationMockObject1))
      .mockReturnValueOnce(Promise.resolve(EditorInformationMockObject2));
    getSupervisorEditorInformationMock.mockReturnValueOnce(Promise.resolve(SupervisorInformationMockObject1))
      .mockReturnValueOnce(Promise.resolve(SupervisorInformationMockObject2));
  });

  afterEach(() => {
    getSurveysMock.mockReset();
    getEditorInformationMock.mockReset();
    getSupervisorEditorInformationMock.mockReset();
  });

  it('Should display a message asking the user to enter their Blaise user credentials if they are not logged in', async () => {
    // arrange
    const user = userMockObject;
    MockAuthenticate.OverrideReturnValues(user, false);

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <App />
        </BrowserRouter>,
      );
    });

    // assert
    const appView = view.getByTestId('login-page');
    expect(appView).toHaveTextContent('Enter your Blaise username and password');
  });

  it.each(validUserRoles)('Should display the surveys page if the user is already logged in', async (userRole) => {
    // arrange
    const user = userMockObject;
    user.role = userRole;

    MockAuthenticate.OverrideReturnValues(user, true);

    // act
    await act(async () => {
      view = render(<BrowserRouter><App /></BrowserRouter>);
    });

    // assert
    const appView = view.getByTestId('app-content');
    expect(appView).toHaveTextContent('Select questionnaire');
  });
});
