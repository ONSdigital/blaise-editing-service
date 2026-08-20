import { Select } from "blaise-design-system-react-components";
import { useState } from "react";

import UserRole from "../../types/user.types";
import questionnaireDisplayName from "../../utils/questionnaireFunctions";
import EditorQuestionnaireDetails from "../editorPage/sections/editorQuestionnaireDetails";
import ResearchQuestionnaireDetails from "../researchPage/sections/researchQuestionnaireDetails";
import SupervisorQuestionnaireDetails from "../supervisorPage/sections/supervisorQuestionnaireDetails";
import SupportQuestionnaireDetails from "../supportPage/sections/supportQuestionnaireDetails";

import ErrorPanel from "./errorPanel";

import type { QuestionnaireDetails } from "../../../common/types/survey.types";
import type Option from "../../types/controls.types";
import type { User } from "blaise-api-node-client";
import type { ReactElement, SetStateAction } from "react";

interface QuestionnairesListProps {
  questionnaires: QuestionnaireDetails[];
  user: User;
}

function renderQuestionnaireDetails(user: User, questionnaire: QuestionnaireDetails) {
  const { role, name } = user;

  if (role === UserRole.SVT_Supervisor) {
    return (
      <SupervisorQuestionnaireDetails
        questionnaire={questionnaire}
        supervisorRole={UserRole.SVT_Supervisor}
        editorRole={UserRole.SVT_Editor}
      />
    );
  }

  if (role === UserRole.SVT_Editor) {
    return (
      <EditorQuestionnaireDetails
        questionnaire={questionnaire}
        username={name}
        editorRole={UserRole.SVT_Editor}
      />
    );
  }

  if (role === UserRole.FRS_Researcher) {
    return <ResearchQuestionnaireDetails questionnaire={questionnaire} />;
  }

  if (role === UserRole.Survey_Support) {
    return <SupportQuestionnaireDetails questionnaire={questionnaire} />;
  }

  return <ErrorPanel message={`User role ${role} not recognised`} />;
}

function getQuestionnaireOptions(questionnaires: QuestionnaireDetails[]): Option[] {
  const options: Option[] = [];

  questionnaires.forEach((questionnaire) => {
    options.push({
      label: `${questionnaireDisplayName(questionnaire.questionnaireName)} (${questionnaire.fieldPeriod})`,
      value: questionnaire.questionnaireName,
    });
  });

  return options;
}

function getDefaultQuestionnaire(questionnaires: QuestionnaireDetails[]): QuestionnaireDetails {
  const defaultQuestionnaire = questionnaires[0];

  if (defaultQuestionnaire === undefined) {
    throw new Error(
      `Unable to determine a default questionnaire: expected at least 1 questionnaire, received ${questionnaires.length}.`,
    );
  }

  return defaultQuestionnaire;
}

function getQuestionnaire(
  questionnaires: QuestionnaireDetails[],
  questionnaireName?: string,
): QuestionnaireDetails {
  return (
    questionnaires.find((q) => q.questionnaireName === questionnaireName) ??
    getDefaultQuestionnaire(questionnaires)
  );
}

function getDefaultQuestionnaireOptionValue(questionnaires: QuestionnaireDetails[]): string {
  const savedQuestionnaireValue = localStorage.getItem("savedQuestionnaireOption") ?? undefined;
  const defaultQuestionnaire = getQuestionnaire(questionnaires, savedQuestionnaireValue);

  return defaultQuestionnaire.questionnaireName;
}

export default function QuestionnairesList({
  questionnaires,
  user,
}: QuestionnairesListProps): ReactElement {
  const [questionnaireValue, setQuestionnaireValue] = useState(() =>
    getDefaultQuestionnaireOptionValue(questionnaires),
  );

  const handleQuestionnaireChange = (e: { target: { value: SetStateAction<string> } }) => {
    setQuestionnaireValue(e.target.value);
    localStorage.setItem("savedQuestionnaireOption", e.target.value.toString());
  };

  return (
    <>
      <Select
        id="select-questionnaire"
        label="Select questionnaire"
        options={getQuestionnaireOptions(questionnaires)}
        value={questionnaireValue}
        onChange={handleQuestionnaireChange}
      />
      {renderQuestionnaireDetails(user, getQuestionnaire(questionnaires, questionnaireValue))}
    </>
  );
}
