import { ReactElement, SetStateAction, useState } from 'react';
import { ONSSelect } from 'blaise-design-system-react-components';
import { QuestionnaireDetails } from '../../../common/interfaces/surveyInterface';
import Option from '../../Interfaces/controlsInterface';
import questionnaireDisplayName from '../functions/QuestionnaireFunctions';
import EditorQuestionnairesDetails from '../../Editor/Components/EditorQuestionnaireDetails';

interface QuestionnairesListProps {
  questionnaires: QuestionnaireDetails[];
}

function RenderQuestionnaireDetails(questionnaire:QuestionnaireDetails) {
  return <EditorQuestionnairesDetails questionnaire={questionnaire} />;
}

function getquestionnaireOptions(questionnaires: QuestionnaireDetails[]): Option[] {
  const options: Option[] = [];

  questionnaires.forEach((questionnaire) => {
    options.push({
      label: `${questionnaireDisplayName(questionnaire.questionnaireName)} (${questionnaire.fieldPeriod})`,
      value: questionnaire.questionnaireName,
    });
  });

  return options;
}

function getDefaultQuestionnaire(questionnaires: QuestionnaireDetails[]) : QuestionnaireDetails {
  const defaultQuestionnaire = questionnaires[0];
  if (defaultQuestionnaire === undefined) {
    throw Error('Questionnaires');
  }

  return defaultQuestionnaire;
}

function getQuestionnaire(questionnaires: QuestionnaireDetails[], questionnaireName?: string) : QuestionnaireDetails {
  return questionnaires.find((q) => q.questionnaireName === questionnaireName) ?? getDefaultQuestionnaire(questionnaires);
}

function getDefaultQuestionnaireOptionValue(questionnaires: QuestionnaireDetails[]): string {
  const savedQuestionnaireValue = localStorage.getItem('savedQuestionnaireOption') ?? undefined;
  const defaultQuestionnaire = getQuestionnaire(questionnaires, savedQuestionnaireValue);

  return defaultQuestionnaire.questionnaireName;
}

export default function QuestionnairesList({ questionnaires }: QuestionnairesListProps): ReactElement {
  const [questionnaireValue, setQuestionnaireValue] = useState(getDefaultQuestionnaireOptionValue(questionnaires));

  const handleQuestionnaireChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setQuestionnaireValue(e.target.value);
    localStorage.setItem('savedQuestionnaireOption', e.target.value.toString());
  };

  return (
    <>
      <ONSSelect
        defaultValue={questionnaireValue}
        id="select-questionnaire"
        label="Select questionnaire"
        options={getquestionnaireOptions(questionnaires)}
        value=""
        onChange={handleQuestionnaireChange}
        testId="select-questionnaire"
      />
      {
        RenderQuestionnaireDetails(getQuestionnaire(questionnaires, questionnaireValue))
      }
    </>
  );
}
