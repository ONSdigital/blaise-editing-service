import {
  DefaultErrorBoundary, Footer, Header, NotProductionWarning,
} from 'blaise-design-system-react-components';
import React from 'react';

const divStyle = {
  minHeight: 'calc(67vh)',
};

interface LayoutTemplateProps {
  children: React.ReactNode;
}

export default function LayoutTemplate({ children }: LayoutTemplateProps) {
  return (

    <>
      <NotProductionWarning />
      <Header
        title="Blaise Questionnaire Trainer"
        noSave
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
