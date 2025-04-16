import { ReactElement } from 'react';
import { ONSPanel } from 'blaise-design-system-react-components';
import { QuestionnaireDetails } from '../../../common/interfaces/surveyInterface';
import CaseSearchForm from '../../Common/components/CaseSearchForm';
import UserRole from '../../Common/enums/UserTypes';

interface RSupportContentProps {
  questionnaire: QuestionnaireDetails;
}

export default function SupportContent({ questionnaire }: RSupportContentProps): ReactElement {
  return (
    <div className="questionnaire">
      <ONSPanel status="info">
        <dl
          className="ons-metadata ons-metadata__list ons-grid ons-grid--gutterless ons-u-cf ons-u-mb-no"
          title="Questionnares"
          data-testid={`${questionnaire.questionnaireName}-Support-Content`}
        >
          <dt className="ons-description-list__term ons-grid__col ons-col-6@m">Field period</dt>
          <dd className="ons-description-list__value ons-grid__col ons-col-6@m">{questionnaire.fieldPeriod}</dd>
          <dt className="ons-description-list__term ons-grid__col ons-col-6@m">Total number of cases</dt>
          <dd className="ons-description-list__value ons-grid__col ons-col-6@m">{questionnaire.numberOfCases}</dd>
        </dl>
      </ONSPanel>
      {/* <div className="ons-summary ons-u-mb-m">
        <div className="ons-summary__group">
          <table className="ons-summary__items">
            <thead className="ons-u-vh">
              <tr>
                <th>Detail</th>
                <th>Output</th>
              </tr>
            </thead>
            <tbody className="ons-summary__item">
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
            <tbody className="ons-summary__item">
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
      </div> */}

      <br />
      <CaseSearchForm questionnaireName={questionnaire.questionnaireName} userRole={UserRole.Survey_Support} />

    </div>
  );
}
