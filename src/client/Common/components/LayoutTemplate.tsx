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
}

export default function LayoutTemplate({ children }: LayoutTemplateProps) {
  const navigate = useNavigate();

  return (

    <>
      <NotProductionWarning />
      <Header
        title="Blaise Questionnaire Trainer"
        noSave
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
