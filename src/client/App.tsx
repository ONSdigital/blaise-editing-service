import './App.css';
import { Footer, Header } from 'blaise-design-system-react-components';
import { ReactElement, useState } from 'react';
import AppRoutes from './components/AppRoutes';
import LoginClient from './clients/Login';

const divStyle = {
  minHeight: 'calc(67vh)',
};

function App(): ReactElement {
  const [loggedIn, setLoggedIn] = useState(false);
  const loginClient = new LoginClient(loggedIn, setLoggedIn);
  const navigationLinks = [
    {
      endpoint: '/',
      id: 'home',
      label: 'Home',
    },
  ];

  return (
    <>
      <Header
        title="Blaise Editing Service"
        noSave
        signOutButton={loginClient.loggedIn}
        signOutFunction={() => loginClient.signOut()}
        navigationLinks={navigationLinks}
      />
      <div style={divStyle} className="ons-page__container ons-container" data-testid="app-content">
        <AppRoutes loginClient={loginClient} />
      </div>
      <Footer />
    </>
  );
}

export default App;
