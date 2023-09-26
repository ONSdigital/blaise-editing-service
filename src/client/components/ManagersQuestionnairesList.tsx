import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { QuestionnaireCaseDetails } from '../../common/interfaces/surveyInterface';

interface ManagersQuestionnairesListProps {
  questionnaires: QuestionnaireCaseDetails[];
}

export default function ManagersQuestionnairesList({ questionnaires }: ManagersQuestionnairesListProps): ReactElement {
  return (
    <dl
      className="ons-metadata ons-metadata__list ons-grid ons-grid--gutterless ons-u-cf ons-u-mb-no"
      title="Questionnares"
      data-testid="QuestionnaireList"
      style={{ padding: '0 0 15px 5px' }}
    >
      <dt className="ons-metadata__term ons-grid__col ons-col-4@m">Questionnaire</dt>
      <dd className="ons-metadata__value ons-grid__col ons-col-8@m" style={{ fontWeight: 'bold' }}>Cases allocated / unallocated</dd>
      {questionnaires.map((questionnaire) => (
        <React.Fragment key={questionnaire.questionnaireName}>
          <dt className="ons-metadata__term ons-grid__col ons-col-4@m">
            <Link to={`/questionnaires/${questionnaire.questionnaireName}/allocation`} style={{ fontWeight: 'normal' }}>
              {questionnaire.questionnaireName}
            </Link>
          </dt>
          <dd className="ons-metadata__value ons-grid__col ons-col-8@m">
            {questionnaire.numberOfCasesAllocated}
            {' '}
            /
            {' '}
            {questionnaire.numberOfCases}
          </dd>
        </React.Fragment>
      ))}
    </dl>

  );
}
