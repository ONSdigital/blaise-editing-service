import { useParams } from "react-router-dom";

import UserRole from "../../../types/user.types";
import questionnaireDisplayName from "../../../utils/questionnaireFunctions";
import CaseSearchForm from "../../shared/caseSearchForm";

import type { AllocateParams } from "../allocate";
import type { ReactElement } from "react";

export default function CaseSearch(): ReactElement {
  const { questionnaireName } = useParams<AllocateParams>();

  if (!questionnaireName) {
    throw new Error("questionnaireName is required");
  }

  return (
    <div className="questionnaire">
      <br />
      <h1>{questionnaireDisplayName(questionnaireName)}</h1>
      <CaseSearchForm
        questionnaireName={questionnaireName}
        userRole={UserRole.SVT_Supervisor}
      />
    </div>
  );
}
