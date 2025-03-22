import { ReactElement } from 'react';
import { ONSPanel } from 'blaise-design-system-react-components';
import { QuestionnaireDetails } from '../../../common/interfaces/surveyInterface';
import CaseSearchForm from '../../Common/components/CaseSearchForm';
import UserRole from '../../Common/enums/UserTypes';

interface ResearchContentProps {
  questionnaire: QuestionnaireDetails;
}

export default function ResearchContent({ questionnaire }: ResearchContentProps): ReactElement {
  return (
    <div className="questionnaire">
      <ONSPanel status="info">
        <dl
          className="ons-metadata ons-metadata__list ons-grid ons-grid--gutterless ons-u-cf ons-u-mb-no"
          title="Questionnares"
          data-testid={`${questionnaire.questionnaireName}-Research-Content`}
          style={{ padding: '0 0 15px 5px' }}
        >
          <dt className="ons-description-list__term ons-grid__col ons-col-5@m">Field period:</dt>
          <dd className="ons-description-list__value ons-grid__col ons-col-7@m">{questionnaire.fieldPeriod}</dd>
          <dt className="ons-description-list__term ons-grid__col ons-col-5@m">Total number of cases:</dt>
          <dd className="ons-description-list__value ons-grid__col ons-col-7@m">{questionnaire.numberOfCases}</dd>
        </dl>
      </ONSPanel>
      <br />

      <CaseSearchForm questionnaireName={questionnaire.questionnaireName} userRole={UserRole.FRS_Researcherer} />

    </div>
  );
}
