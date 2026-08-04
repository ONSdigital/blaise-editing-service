import { Accordion, ONSPanel } from 'blaise-design-system-react-components';
import { ExpandableContent } from 'blaise-design-system-react-components/build/src/components/Accordion';
import { ReactElement } from 'react';
import { User } from 'blaise-api-node-client';
import { Survey } from '../../../common/interfaces/surveyInterface';
import QuestionnairesList from './QuestionnairesList';

interface SurveysListProps {
  surveys: Survey[]
  user: User
}

function CreateContent(surveys:Survey[], user:User):ExpandableContent[] {
  return surveys.map(({ name, questionnaires }) => ({
    title: name, content: <QuestionnairesList questionnaires={questionnaires} user={user} />, contentId: 'survey',
  }));
}

export default function SurveysList({ surveys, user }: SurveysListProps): ReactElement {
  if (surveys.length === 0) {
    return (
      <ONSPanel spacious status="info">There are no surveys available</ONSPanel>
    );
  }

  return (
    <>
      <br />
      <Accordion ContentId="survey" Expandables={CreateContent(surveys, user)} Expanded />
    </>
  );
}
