import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { QuestionnaireDetails } from '../../common/interfaces/surveyInterface';

interface ManagersQuestionnairesListProps {
  questionnaires: QuestionnaireDetails[];
}

export default function ManagersQuestionnairesList({ questionnaires }: ManagersQuestionnairesListProps): ReactElement {
  return (
    <>
      {questionnaires.map((questionnaire) => (
        <div key={questionnaire.questionnaireName}>
          <br />
          <div className="ons-summary">
            <div id="turnover" className="ons-summary__group">
              <h2 className="ons-summary__group-title">{questionnaire.questionnaireName}</h2>
              <div className="ons-summary__items">
                <div id="sales-dates-row" className="ons-summary__item">
                  <dl className="ons-summary__row ons-summary__row--has-values" id="sales-dates">
                    <dt className="ons-summary__item-title">
                      <div className="ons-summary__item--text">Cases Allocted</div>
                    </dt>
                    <dd className="ons-summary__values">
                      <span className="ons-summary__text">{questionnaire.numberOfCasesAllocated}</span>
                    </dd>
                    <dd className="ons-summary__actions">
                      <span
                        className="ons-summary__button-text"
                        aria-hidden="true"
                      >
                        <Link to={`questionnaires/${questionnaire.questionnaireName}/allocation/allocated`} style={{ fontWeight: 'normal' }}>
                          Cases allocated to editors
                        </Link>
                      </span>
                      <span className="ons-u-vh">Cases allocated to editors</span>
                    </dd>
                  </dl>
                </div>
                <div id="sales-value-row" className="ons-summary__item">
                  <dl className="ons-summary__row ons-summary__row--has-values" id="sales-value">
                    <dt className="ons-summary__item-title">
                      <div className="ons-summary__item--text">Cases left to allocate</div>
                    </dt>
                    <dd className="ons-summary__values">
                      <span className="ons-summary__text">
                        {questionnaire.numberOfCases - questionnaire.numberOfCasesAllocated}
                        {' '}
                      </span>
                    </dd>
                    <dd className="ons-summary__actions">
                      <span
                        className="ons-summary__button-text"
                        aria-hidden="true"
                      >
                        <Link to={`questionnaires/${questionnaire.questionnaireName}/allocation/allocate`} style={{ fontWeight: 'normal' }}>
                          Allocate Cases to editors
                        </Link>
                      </span>
                      <span className="ons-u-vh">Allocate Cases to editors</span>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <hr />
        </div>
      ))}

    </>
  );
}
