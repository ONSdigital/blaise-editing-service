import { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import { ONSPanel } from 'blaise-design-system-react-components';
import CaseSearchForm from '../../Common/components/CaseSearchForm';
import { AllocateParams } from '../Pages/Allocate';
import UserRole from '../../Common/enums/UserTypes';
import questionnaireDisplayName from '../../Common/functions/QuestionnaireFunctions';

export type CaseSearchParams = {
  questionnaireName: string
};

export default function CaseSearch(): ReactElement {
  const { questionnaireName } = useParams<keyof AllocateParams>() as AllocateParams;

  return (
    <div className="questionnaire">
      <ONSPanel status="info">
        <dl
          className="ons-metadata ons-metadata__list ons-grid ons-grid--gutterless ons-u-cf ons-u-mb-no"
          title="Questionnares"
          data-testid={`${questionnaireName}-Search-Content`}
          style={{ padding: '0 0 15px 5px' }}
        >
          <dt className="ons-description-list__term ons-grid__col ons-col-5@m">Questionnaire Name:</dt>
          <dd className="ons-description-list__value ons-grid__col ons-col-7@m">{questionnaireDisplayName(questionnaireName)}</dd>
        </dl>
      </ONSPanel>
      <br />
      <CaseSearchForm questionnaireName={questionnaireName} userRole={UserRole.SVT_Supervisor} />

    </div>
  );
}
