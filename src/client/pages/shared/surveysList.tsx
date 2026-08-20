import { Collapsible, Panel } from "blaise-design-system-react-components";

import QuestionnairesList from "./questionnairesList";

import type { Survey } from "../../../common/types/survey.types";
import type { User } from "blaise-api-node-client";
import type { ReactElement } from "react";

interface SurveysListProps {
  surveys: Survey[];
  user: User;
}

export default function SurveysList({ surveys, user }: SurveysListProps): ReactElement {
  if (surveys.length === 0) {
    return (
      <Panel
        spacious
        status="info"
      >
        There are no surveys available
      </Panel>
    );
  }

  return (
    <>
      <br />
      <div
        id="survey"
        data-testid="survey-accordion"
      >
        {surveys.map(({ name, questionnaires }, index) => (
          <Collapsible
            key={name}
            id={`survey-${index}`}
            title={name}
          >
            <QuestionnairesList
              questionnaires={questionnaires}
              user={user}
            />
          </Collapsible>
        ))}
      </div>
    </>
  );
}
