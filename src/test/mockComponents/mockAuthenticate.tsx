import { ReactElement } from 'react';
import { Authenticate } from 'blaise-login-react-client';
import { User } from 'blaise-api-node-client';
import userMockObject from '../mockObjects/userMockObject';

export default class MockAuthenticate extends Authenticate {
  static user: User = userMockObject;

  static loggedIn:boolean = true;

  static logOutFunction: () => void = () => {};

  static OverrideReturnValues(user?: User, loggedIn?:boolean, logOutFunction?: () => void) {
    this.user = user ?? MockAuthenticate.user;
    this.loggedIn = loggedIn ?? MockAuthenticate.loggedIn;
    this.logOutFunction = logOutFunction ?? MockAuthenticate.logOutFunction;
  }

  override render(): ReactElement {
    return (
      <div>
        {
        MockAuthenticate.loggedIn
          ? <div data-testid="content-page">{this.props.children(MockAuthenticate.user, MockAuthenticate.loggedIn, MockAuthenticate.logOutFunction)}</div>
          : <div data-testid="login-page">Enter your Blaise username and password</div>
        }
      </div>
    );
  }
}
