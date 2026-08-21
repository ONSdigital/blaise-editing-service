import UserRole from "../../../types/user.types";
import CaseSearchForm from "../../shared/caseSearchForm";

import type { QuestionnaireDetails } from "../../../../common/types/survey.types";
import type { ReactElement } from "react";

interface SupportContentProps {
  questionnaire: QuestionnaireDetails;
}

export default function SupportContent({ questionnaire }: SupportContentProps): ReactElement {
  return (
    <div
      className="questionnaire ons-u-mb-xl"
      data-testid={`${questionnaire.questionnaireName}-Support-Content`}
    >
      <CaseSearchForm
        questionnaireName={questionnaire.questionnaireName}
        userRole={UserRole.Survey_Support}
      />
    </div>
  );
}
