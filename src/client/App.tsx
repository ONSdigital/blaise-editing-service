import './App.css';
import { ReactElement } from 'react';
import { Authenticate } from 'blaise-login-react-client';
import AppRoutes from './Common/components/AppRoutes';
import LayoutTemplate from './Common/components/LayoutTemplate';
import { isProduction } from './env';
import { NotProductionWarning } from 'blaise-design-system-react-components';

function App(): ReactElement {
  return (
    <Authenticate title="Blaise Editing Service">
      {(user, loggedIn, logOutFunction) => (
        <>
          <a className="ons-skip-link">Skip to content</a>
          {
            isProduction(window.location.hostname) ? <></> : <NotProductionWarning />
          }
          <LayoutTemplate showSignOutButton={loggedIn} signOut={() => logOutFunction()}>
            <AppRoutes user={user} />
          </LayoutTemplate>
        </>
      )}
    </Authenticate>

  );
}

export default App;
