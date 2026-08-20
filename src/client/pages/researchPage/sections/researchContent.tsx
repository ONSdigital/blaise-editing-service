import { type ReactElement } from "react";

import { type QuestionnaireDetails } from "../../../../common/types/survey.types";
import UserRole from "../../../types/user.types";
import CaseSearchForm from "../../shared/caseSearchForm";

interface ResearchContentProps {
  questionnaire: QuestionnaireDetails;
}

export default function ResearchContent({ questionnaire }: ResearchContentProps): ReactElement {
  return (
    <div
      className="questionnaire ons-u-mb-xl"
      data-testid={`${questionnaire.questionnaireName}-Research-Content`}
    >
      <CaseSearchForm
        questionnaireName={questionnaire.questionnaireName}
        userRole={UserRole.FRS_Researcher}
      />
    </div>
  );
}
