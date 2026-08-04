import './App.css';
import { ReactElement } from 'react';
import { Authenticate } from 'blaise-login-react/blaise-login-react-client';
import AppRoutes from './pages/shared/AppRoutes';
import LayoutTemplate from './pages/shared/LayoutTemplate';

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
