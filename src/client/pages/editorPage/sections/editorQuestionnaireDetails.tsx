import { type ReactElement } from "react";

import { type QuestionnaireDetails } from "../../../../common/types/survey.types";
import { getEditorInformation } from "../../../api/nodeApi";
import { useAsyncRequest } from "../../../utils/useAsyncRequest";
import AsyncContent from "../../shared/asyncContent";

import EditorContent from "./editorContent";

import type UserRole from "../../../types/user.types";

interface EditorQuestionnaireDetailsProps {
  questionnaire: QuestionnaireDetails;
  username: string;
  editorRole: UserRole;
}

export default function EditorQuestionnaireDetails({
  questionnaire,
  username,
  editorRole,
}: EditorQuestionnaireDetailsProps): ReactElement {
  const editorInformation = useAsyncRequest(
    getEditorInformation,
    questionnaire.questionnaireName,
    username,
    editorRole,
  );

  return (
    <div
      className="questionnaire"
      data-testid="questionnaire"
    >
      <AsyncContent content={editorInformation}>
        {(loadedEditorInformation) => (
          <EditorContent
            editorInformation={loadedEditorInformation}
            questionnaire={questionnaire}
          />
        )}
      </AsyncContent>
    </div>
  );
}
