import { type ReactElement } from "react";

import { type QuestionnaireDetails } from "../../../../common/types/survey.types";

import ResearchContent from "./researchContent";

interface ResearchQuestionnaireDetailsProps {
  questionnaire: QuestionnaireDetails;
}

export default function ResearchQuestionnaireDetails({
  questionnaire,
}: ResearchQuestionnaireDetailsProps): ReactElement {
  return (
    <div
      className="questionnaire"
      data-testid="questionnaire"
    >
      <ResearchContent questionnaire={questionnaire} />
    </div>
  );
}
