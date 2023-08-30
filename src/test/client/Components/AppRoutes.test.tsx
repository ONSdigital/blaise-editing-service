import {
  RenderResult, act, render, screen,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { IMock, Mock } from 'typemoq';
import { ReactElement } from 'react';
import AppRoutes from '../../../client/components/AppRoutes';
import LoginClient from '../../../client/clients/Login';

describe('Renders the correct page when a user first accesses the service', () => {
  const loginClientMock: IMock<LoginClient> = Mock.ofType(LoginClient);
  let view:RenderResult;

  afterEach(() => {
    loginClientMock.reset();
  });

  it('Should show the login page if the user has not logged in', () => {
    // arrange
    loginClientMock.setup((lc) => lc.loggedIn).returns(() => false);
    loginClientMock.setup((lc) => lc.loginPage()).returns(():ReactElement => <>Enter your Blaise username and password</>);

    // act
    render(<BrowserRouter><AppRoutes loginClient={loginClientMock.object} /></BrowserRouter>);

    // assert
    const loginText = screen.getByText(/Enter your Blaise username and password/i);

    expect(loginText).toBeInTheDocument();
  });

  it('Should render the login page correctly if the user has not logged in', async () => {
    // arrange
    loginClientMock.setup((lc) => lc.loggedIn).returns(() => false);
    loginClientMock.setup((lc) => lc.loginPage()).returns(():ReactElement => <>Enter your Bliase username and password</>);

    // act
    await act(async () => {
      view = render(<BrowserRouter><AppRoutes loginClient={loginClientMock.object} /></BrowserRouter>);
    });

    // assert
    expect(view).toMatchSnapshot();
  });

  it('Should show the surveys page if the user has logged in', () => {
    // arrange
    loginClientMock.setup((lc) => lc.loggedIn).returns(() => true);

    // act
    render(<BrowserRouter><AppRoutes loginClient={loginClientMock.object} /></BrowserRouter>);

    // assert
    const homePageText = screen.getByText(/Bonjour tout le monde/i);

    expect(homePageText).toBeInTheDocument();
  });

  it('Should render the surveys page correctly if the user has logged in', async () => {
    // arrange
    loginClientMock.setup((lc) => lc.loggedIn).returns(() => true);

    // act
    await act(async () => {
      view = render(<BrowserRouter><AppRoutes loginClient={loginClientMock.object} /></BrowserRouter>);
    });

    // assert
    expect(view).toMatchSnapshot();
  });
});
