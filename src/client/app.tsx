import { NotProductionWarning } from "blaise-design-system-react-components";
import { Authenticate } from "blaise-login-react-client";

import AppRoutes from "./pages/shared/appRoutes";
import LayoutTemplate from "./pages/shared/layoutTemplate";
import { getSharedAuthOptions } from "./utils/auth";
import { isProduction } from "./utils/env";

import type { ReactElement } from "react";

const appStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
};

function App(): ReactElement {
  const authOptions = getSharedAuthOptions();
  const isProductionEnv = isProduction(window.location.hostname);

  return (
    <Authenticate
      title="Blaise Editing Service"
      {...authOptions}
    >
      {(user, loggedIn, logOutFunction) => (
        <div style={appStyle}>
          {!isProductionEnv && <NotProductionWarning />}
          <LayoutTemplate
            showSignOutButton={loggedIn}
            signOut={() => logOutFunction()}
          >
            <AppRoutes user={user} />
          </LayoutTemplate>
        </div>
      )}
    </Authenticate>
  );
}

export default App;
