import {
  DefaultErrorBoundary, Footer, Header, NotProductionWarning,
} from 'blaise-design-system-react-components';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SubNavigationTemplate from './SubNavigation';

const divStyle = {
  minHeight: 'calc(67vh)',
};

interface LayoutTemplateProps {
  children: React.ReactNode;
  showSignOutButton: boolean;
  signOut: () => void;
}

export default function LayoutTemplate({ children, showSignOutButton, signOut }: LayoutTemplateProps) {
  const navigate = useNavigate();

  return (

    <>
      <NotProductionWarning />
      <Header
        title="Blaise Editing Service"
        noSave
        signOutButton={showSignOutButton}
        signOutFunction={() => { signOut(); navigate('/'); }}
        navigationLinks={[
          { id: "home-link", label: "Home", endpoint: "/" },
        ]}
        currentLocation={location.pathname}
        createNavLink={(id: string, label: string, endpoint: string) => (
          <Link to={endpoint} id={id} className="ons-navigation__link">
            {label}
          </Link>
        )}
      />

      <DefaultErrorBoundary>
        <div style={divStyle} className="ons-page__container ons-container" data-testid="app-content">
          {children}
        </div>
      </DefaultErrorBoundary>
      <Footer />
    </>
  );
}
