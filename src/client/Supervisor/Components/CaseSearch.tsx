import { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import CaseSearchForm from '../../Common/components/CaseSearchForm';
import { AllocateParams } from '../Pages/Allocate';
import UserRole from '../../Common/enums/UserTypes';
import questionnaireDisplayName from '../../Common/functions/QuestionnaireFunctions';
import Breadcrumbs from '../../Common/components/Breadcrumbs';

export type CaseSearchParams = {
  questionnaireName: string
};

export default function CaseSearch(): ReactElement {
  const { questionnaireName } = useParams<keyof AllocateParams>() as AllocateParams;

  return (
    <div className="questionnaire">
      <Breadcrumbs BreadcrumbList={
        [
          { link: '/', title: 'Home' },
        ]
      }
      />
      <br />
      <h1>{questionnaireDisplayName(questionnaireName)}</h1>
      <CaseSearchForm questionnaireName={questionnaireName} userRole={UserRole.SVT_Supervisor} />

    </div>
  );
}
