import { ReactElement, SetStateAction, useState } from 'react';
import { ONSSelect } from 'blaise-design-system-react-components';
import { User } from 'blaise-api-node-client';
import { QuestionnaireDetails } from '../../../common/interfaces/surveyInterface';
import Option from '../../Interfaces/controlsInterface';
import UserRole from '../enums/UserTypes';
import SupervisorQuestionnaireDetails from '../../Supervisor/Components/SupervisorQuestionnaireDetails';
import EditorQuestionnaireDetails from '../../Editor/Components/EditorQuestionnaireDetails';
import ErrorPanel from './ErrorPanel';
import questionnaireDisplayName from '../functions/QuestionnaireFunctions';
import ResearchQuestionnaireDetails from '../../Research/Components/ResearchQuestionnaireDetails';
import SupportQuestionnaireDetails from '../../Support/Components/SupportQuestionnaireDetails';

interface QuestionnairesListProps {
  questionnaires: QuestionnaireDetails[];
  user: User
}

function RenderQuestionnaireDetails(user:User, questionnaire:QuestionnaireDetails) {
  const { role, name } = user;

  if (role === UserRole.SVT_Supervisor) {
    return <SupervisorQuestionnaireDetails questionnaire={questionnaire} supervisorRole={UserRole.SVT_Supervisor} editorRole={UserRole.SVT_Editor} />;
  }

  if (role === UserRole.SVT_Editor) {
    return <EditorQuestionnaireDetails questionnaire={questionnaire} username={name} editorRole={UserRole.SVT_Editor} />;
  }

  if (role === UserRole.FRS_Researcher) {
    return <ResearchQuestionnaireDetails questionnaire={questionnaire} />;
  }

  if (role === UserRole.Survey_Support) {
    return <SupportQuestionnaireDetails questionnaire={questionnaire} />;
  }

  return <ErrorPanel message={`User role ${role} not recognised`} />;
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

export default function QuestionnairesList({ questionnaires, user }: QuestionnairesListProps): ReactElement {
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
        RenderQuestionnaireDetails(user, getQuestionnaire(questionnaires, questionnaireValue))
      }
    </>
  );
}
