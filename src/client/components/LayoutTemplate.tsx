import { Footer, Header, NotProductionWarning } from 'blaise-design-system-react-components';
import React from 'react';
import { useNavigate } from 'react-router-dom';

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

  const navigationLinks = [
    {
      endpoint: '/',
      id: 'surveys',
      label: 'Surveys',
    },
  ];

  return (

    <>
      <NotProductionWarning />
      <Header
        title="Blaise Editing Service"
        noSave
        signOutButton={showSignOutButton}
        signOutFunction={() => { signOut(); navigate('/'); }}
        navigationLinks={navigationLinks}
      />
      <div style={divStyle} className="ons-page__container ons-container" data-testid="app-content">

        {children}
      </div>
      <Footer />
    </>
  );
}
