import { ReactElement } from 'react';

import { QuestionnaireDetails } from '../../../common/interfaces/surveyInterface';
import CaseSearchForm from '../../Common/components/CaseSearchForm';
import UserRole from '../../Common/enums/UserTypes';

interface RSupportContentProps {
  questionnaire: QuestionnaireDetails;
}

export default function SupportContent({ questionnaire }: RSupportContentProps): ReactElement {
  return (
    <div className="questionnaire">
      <div className="ons-summary">
        <div className="ons-summary__group">
          <table className="ons-summary__items" data-testid={`${questionnaire.questionnaireName}-Support-Content`}>
            <thead className="ons-u-vh">
              <tr>
                <th>Detail</th>
                <th>Output</th>
              </tr>
            </thead>
            <tbody>
              <tr className="ons-summary__row ons-summary__row--has-values">
                <td className="ons-summary__item-title">
                  <div className="ons-summary__item--text">
                    Field Period
                  </div>
                </td>
                <td className="ons-summary__values" colSpan={2}>
                  {questionnaire.fieldPeriod}
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr className="ons-summary__row ons-summary__row--has-values">
                <td className="ons-summary__item-title">
                  <div className="ons-summary__item--text">
                    Total number of cases
                  </div>
                </td>
                <td className="ons-summary__values" colSpan={2}>
                  {questionnaire.numberOfCases}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <br />
      <CaseSearchForm questionnaireName={questionnaire.questionnaireName} userRole={UserRole.Survey_Support} />

    </div>
  );
}
