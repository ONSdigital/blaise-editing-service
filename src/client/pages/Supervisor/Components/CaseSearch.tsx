import { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import CaseSearchForm from '../../shared/CaseSearchForm';
import { AllocateParams } from '../Pages/Allocate';
import UserRole from '../../../types/UserTypes';
import questionnaireDisplayName from '../../../utils/QuestionnaireFunctions';
import Breadcrumbs from '../../shared/Breadcrumbs';

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
