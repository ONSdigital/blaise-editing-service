import { Questionnaire } from 'blaise-api-node-client';
import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

interface QuestionnairesListProps {
  questionnaires: Questionnaire[];
}

export default function QuestionnairesList({ questionnaires }: QuestionnairesListProps): ReactElement {
  return (
    <dl
      className="ons-metadata ons-metadata__list ons-grid ons-grid--gutterless ons-u-cf ons-u-mb-no"
      title="Questionnares"
      data-testid="QuestionnaireList"
      style={{ padding: '0 0 15px 5px' }}
    >
      <dt className="ons-metadata__term ons-grid__col ons-col-6@m">Questionnaire</dt>
      <dd className="ons-metadata__value ons-grid__col ons-col-6@m" style={{ fontWeight: 'bold' }}>Case Count</dd>
      {questionnaires.map((questionnaire) => (
        <React.Fragment key={questionnaire.name}>
          <dt className="ons-metadata__term ons-grid__col ons-col-6@m">
            <Link to={`/questionnaires/${questionnaire.name}/cases`} style={{ fontWeight: 'normal' }}>
              {questionnaire.name}
            </Link>
          </dt>
          <dd className="ons-metadata__value ons-grid__col ons-col-6@m">{questionnaire.dataRecordCount}</dd>
        </React.Fragment>
      ))}
    </dl>

  );
}
