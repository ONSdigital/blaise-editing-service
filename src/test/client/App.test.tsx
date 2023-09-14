import {
  RenderResult, act, render,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Authenticate } from 'blaise-login-react-client';
import surveyListMockObject from '../mockObjects/surveyListMockObject';
import { getSurveys } from '../../client/clients/NodeApi';
import { Survey } from '../../common/interfaces/surveyInterface';
import userMockObject from '../mockObjects/userMockObject';
import App from '../../client/App';
import MockAuthenticate from '../mockComponents/mockAuthenticate';

// set global variables
const validUserRoles:string[] = ['Manager', 'Editor'];
let view:RenderResult;

// create mocks
jest.mock('blaise-login-react-client');
Authenticate.prototype.render = MockAuthenticate.prototype.render;

jest.mock('../../client/clients/NodeApi');
const getSurveysMock = getSurveys as jest.Mock<Promise<Survey[]>>;

describe('Renders the correct screen depending if the user has recently logged in', () => {
  beforeEach(() => {
    getSurveysMock.mockImplementation(() => Promise.resolve(surveyListMockObject));
  });

  afterEach(() => {
    getSurveysMock.mockReset();
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
    expect(appView).toHaveTextContent(`Bonjour tout le monde ${user.name}`);
  });
});
