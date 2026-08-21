import { type ReactElement } from "react";
import { Route } from "react-router-dom";

import UserRole from "../../types/user.types";
import CaseSummary from "../editorPage/caseSummary";
import EditorPage from "../editorPage/editorPage";
import ResearchPage from "../researchPage/researchPage";
import Allocate from "../supervisorPage/allocate";
import CaseSearch from "../supervisorPage/sections/caseSearch";
import SupervisorPage from "../supervisorPage/supervisorPage";
import SupportPage from "../supportPage/supportPage";

import CreateRoutes from "./createRoutes";
import EditCaseContent from "./editCaseContent";

import type { User } from "blaise-api-node-client";

interface AppContentProps {
  user: User;
}

export default function AppRoutes({ user }: AppContentProps): ReactElement {
  const userRole: UserRole = user.role as UserRole;

  return (
    <>
      <CreateRoutes when={userRole === UserRole.SVT_Supervisor}>
        <Route
          path="/"
          element={<SupervisorPage user={user} />}
        />
        <Route
          path="/questionnaires/:questionnaireName/allocate"
          element={
            <Allocate
              supervisorRole={UserRole.SVT_Supervisor}
              editorRole={UserRole.SVT_Editor}
              reallocate={false}
            />
          }
        />
        <Route
          path="/questionnaires/:questionnaireName/reallocate"
          element={
            <Allocate
              supervisorRole={UserRole.SVT_Supervisor}
              editorRole={UserRole.SVT_Editor}
              reallocate
            />
          }
        />
        <Route
          path="/questionnaires/:questionnaireName/cases/search"
          element={<CaseSearch />}
        />
        <Route
          path="/questionnaires/:questionnaireName/cases/:caseId/editcase"
          element={<EditCaseContent role={userRole} />}
        />
      </CreateRoutes>

      <CreateRoutes when={userRole === UserRole.SVT_Editor}>
        <Route
          path="/"
          element={<EditorPage user={user} />}
        />
        <Route
          path="/questionnaires/:questionnaireName/cases/:caseId/summary"
          element={<CaseSummary />}
        />
      </CreateRoutes>

      <CreateRoutes when={userRole === UserRole.FRS_Researcher}>
        <Route
          path="/"
          element={<ResearchPage user={user} />}
        />
        <Route
          path="/questionnaires/:questionnaireName/cases/:caseId/editcase"
          element={<EditCaseContent role={userRole} />}
        />
      </CreateRoutes>

      <CreateRoutes when={userRole === UserRole.Survey_Support}>
        <Route
          path="/"
          element={<SupportPage user={user} />}
        />
        <Route
          path="/questionnaires/:questionnaireName/cases/:caseId/editcase"
          element={<EditCaseContent role={userRole} />}
        />
      </CreateRoutes>
    </>
  );
}
