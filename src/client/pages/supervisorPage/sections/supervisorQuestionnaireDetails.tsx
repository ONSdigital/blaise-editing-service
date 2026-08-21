import { getSupervisorEditorInformation } from "../../../api/nodeApi";
import { useAsyncRequest } from "../../../utils/useAsyncRequest";
import AsyncContent from "../../shared/asyncContent";

import SupervisorContent from "./supervisorContent";

import type { QuestionnaireDetails } from "../../../../common/types/survey.types";
import type UserRole from "../../../types/user.types";
import type { ReactElement } from "react";

interface SupervisorQuestionnaireDetailsProps {
  questionnaire: QuestionnaireDetails;
  supervisorRole: UserRole;
  editorRole: UserRole;
}

export default function SupervisorQuestionnaireDetails({
  questionnaire,
  supervisorRole,
  editorRole,
}: SupervisorQuestionnaireDetailsProps): ReactElement {
  const supervisorInformation = useAsyncRequest(
    getSupervisorEditorInformation,
    questionnaire.questionnaireName,
    supervisorRole,
    editorRole,
  );

  return (
    <div
      className="questionnaire"
      data-testid="questionnaire"
    >
      <AsyncContent content={supervisorInformation}>
        {(loadedSupervisorInformation) => (
          <SupervisorContent
            supervisorInformation={loadedSupervisorInformation}
            questionnaire={questionnaire}
          />
        )}
      </AsyncContent>
    </div>
  );
}
