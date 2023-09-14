import './App.css';
import { ReactElement } from 'react';
import { Authenticate } from 'blaise-login-react-client';
import AppContent from './components/AppContent';
import LayoutTemplate from './components/LayoutTemplate';

function App(): ReactElement {
  return (
    <Authenticate title="Blaise editing service">
      {(user, loggedIn, logOutFunction) => (
        <LayoutTemplate showSignOutButton={loggedIn} signOut={() => logOutFunction()}>
          <AppContent user={user} />
        </LayoutTemplate>
      )}
    </Authenticate>

  );
}

export default App;
