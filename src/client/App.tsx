import './App.css';
import { ReactElement } from 'react';
import { Authenticate } from 'blaise-login-react-client';
import AppRoutes from './Common/components/AppRoutes';
import LayoutTemplate from './Common/components/LayoutTemplate';

function App(): ReactElement {
  return (
    <Authenticate title="Blaise editing service">
      {(user, loggedIn, logOutFunction) => (
        <LayoutTemplate showSignOutButton={loggedIn} signOut={() => logOutFunction()}>
          <AppRoutes user={user} />
        </LayoutTemplate>
      )}
    </Authenticate>

  );
}

export default App;
