import { ReactElement } from 'react';
import { Route } from 'react-router-dom';
import { User } from 'blaise-api-node-client';
import UserRole from '../enums/UserTypes';
import CreateRoutes from './CreateRoutes';
import SupervisorHome from '../../Supervisor/Pages/SupervisorHome';
import EditorHome from '../../Editor/Pages/EditorHome';
import Allocate from '../../Supervisor/Pages/Allocate';
import CaseSummary from '../../Editor/Pages/CaseSummary';
import ResearchHome from '../../Research/Pages/ResearchHome';
import CaseSearch from '../../Supervisor/Components/CaseSearch';
import EditCaseContent from './EditCaseContent';
import SupportHome from '../../Support/Pages/SupportHome';

interface AppContentProps {
  user:User
}

export default function AppContent({ user }: AppContentProps): ReactElement {
  const userRole: UserRole = user.role as UserRole;

  return (
    <>
      <CreateRoutes onConditionThat={userRole === UserRole.SVT_Supervisor}>
        <Route path="/" element={<SupervisorHome user={user} />} />
        <Route path="/questionnaires/:questionnaireName/allocate" element={<Allocate supervisorRole={UserRole.SVT_Supervisor} editorRole={UserRole.SVT_Editor} reallocate={false} />} />
        <Route path="/questionnaires/:questionnaireName/reallocate" element={<Allocate supervisorRole={UserRole.SVT_Supervisor} editorRole={UserRole.SVT_Editor} reallocate />} />
        <Route path="questionnaires/:questionnaireName/cases/search" element={<CaseSearch />} />
        <Route path="/questionnaires/:questionnaireName/cases/:caseId/editcase" element={<EditCaseContent role={userRole} />} />
      </CreateRoutes>

      <CreateRoutes onConditionThat={userRole === UserRole.SVT_Editor}>
        <Route path="/" element={<EditorHome user={user} />} />
        <Route path="questionnaires/:questionnaireName/cases/:caseId/summary" element={<CaseSummary />} />
      </CreateRoutes>

      <CreateRoutes onConditionThat={userRole === UserRole.FRS_Researcher}>
        <Route path="/" element={<ResearchHome user={user} />} />
        <Route path="/questionnaires/:questionnaireName/cases/:caseId/editcase" element={<EditCaseContent role={userRole} />} />
      </CreateRoutes>

      <CreateRoutes onConditionThat={userRole === UserRole.Survey_Support}>
        <Route path="/" element={<SupportHome user={user} />} />
        <Route path="/questionnaires/:questionnaireName/cases/:caseId/editcase" element={<EditCaseContent role={userRole} />} />
      </CreateRoutes>
    </>
  );
}
