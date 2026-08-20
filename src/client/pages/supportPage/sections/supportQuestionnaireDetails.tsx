import { type ReactElement } from "react";

import { type QuestionnaireDetails } from "../../../../common/types/survey.types";

import SupportContent from "./supportContent";

interface SupportQuestionnaireDetailsProps {
  questionnaire: QuestionnaireDetails;
}

export default function SupportQuestionnaireDetails({
  questionnaire,
}: SupportQuestionnaireDetailsProps): ReactElement {
  return (
    <div
      className="questionnaire"
      data-testid="questionnaire"
    >
      <SupportContent questionnaire={questionnaire} />
    </div>
  );
}
