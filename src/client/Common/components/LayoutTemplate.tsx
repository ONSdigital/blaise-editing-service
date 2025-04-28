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
        title="Blaise Editing Service 22"
        noSave
        signOutButton={showSignOutButton}
        signOutFunction={() => { signOut(); navigate('/'); }}
      />

      <SubNavigationTemplate>
        <Link
          className="ons-navigation__link"
          to=".."
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          <strong>{'< Back'}</strong>
        </Link>
      </SubNavigationTemplate>

      <DefaultErrorBoundary>
        <div style={divStyle} className="ons-page__container ons-container" data-testid="app-content">
          {children}
        </div>
      </DefaultErrorBoundary>
      <Footer />
    </>
  );
}
