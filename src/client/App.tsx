import './App.css';
import { ReactElement } from 'react';
import { Authenticate } from 'blaise-login-react/blaise-login-react-client';
import AppRoutes from './Common/components/AppRoutes';
import LayoutTemplate from './Common/components/LayoutTemplate';

function App(): ReactElement {
  return (
    <Authenticate title="Blaise Editing Service">
      {(user, loggedIn, logOutFunction) => (
        <LayoutTemplate showSignOutButton={loggedIn} signOut={() => logOutFunction()}>
          <AppRoutes user={user} />
        </LayoutTemplate>
      )}
    </Authenticate>

  );
}

export default App;
