import { ONSPanel } from 'blaise-design-system-react-components';
import { AuthManager, LoginForm } from 'blaise-login-react-client';
import { ReactElement, useEffect } from 'react';

interface LoginProps {
  authManager:AuthManager;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginPage({ authManager, setLoggedIn }: LoginProps): ReactElement {
  useEffect(() => {
    authManager.loggedIn().then((isLoggedIn: boolean) => {
      setLoggedIn(isLoggedIn);
    });
  }, [authManager, setLoggedIn]);

  return (
    <>
      <ONSPanel status="info">Enter your Blaise username and password</ONSPanel>
      <LoginForm authManager={authManager} setLoggedIn={setLoggedIn} />
    </>
  );
}
