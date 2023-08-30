import { ReactElement } from 'react';
import { AuthManager } from 'blaise-login-react-client';
import LoginPage from '../pages/Login';

export default class LoginClient {
  authManager: AuthManager;

  loggedIn: boolean;

  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;

  constructor(loggedIn: boolean, setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>) {
    this.authManager = new AuthManager();
    this.loggedIn = loggedIn;
    this.setLoggedIn = setLoggedIn;
  }

  signOut() {
    this.authManager.clearToken();
    this.setLoggedIn(false);
  }

  loginPage(): ReactElement {
    return LoginPage({
      authManager: this.authManager,
      setLoggedIn: this.setLoggedIn,
    });
  }
}
