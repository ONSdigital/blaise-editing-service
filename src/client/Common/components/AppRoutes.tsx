import { ReactElement } from 'react';
import { Route } from 'react-router-dom';
import { User } from 'blaise-api-node-client';
import Allocate from '../../Manager/Pages/Allocate';
import Cases from '../../Editor/Pages/Cases';
import CaseFactsheet from '../../Editor/Pages/CaseFactsheet';
import UserRole from '../enums/UserRole';
import CreateRoutes from './CreateRoutes';
import CurrentlyAllocated from '../../Manager/Pages/CurrentlyAllocated';
import ManagerHome from '../../Manager/Pages/ManagerHome';
import EditorHome from '../../Editor/Pages/EditorHome';

interface AppContentProps {
  user:User
}

export default function AppContent({ user }: AppContentProps): ReactElement {
  const userRole:UserRole = UserRole[user.role as UserRole];

  return (
    <>
      <CreateRoutes onConditionThat={userRole === UserRole.Manager}>
        <Route path="/" element={<ManagerHome user={user} />} />
        <Route path="questionnaires/:questionnaireName/allocation/allocate" element={<Allocate />} />
        <Route path="questionnaires/:questionnaireName/allocation/allocated" element={<CurrentlyAllocated />} />
      </CreateRoutes>

      <CreateRoutes onConditionThat={userRole === UserRole.Editor}>
        <Route path="/" element={<EditorHome user={user} />} />
        <Route path="questionnaires/:questionnaireName/cases/" element={<Cases user={user} />} />
        <Route path="questionnaires/:questionnaireName/cases/:caseId/factsheet" element={<CaseFactsheet />} />
      </CreateRoutes>
    </>
  );
}
