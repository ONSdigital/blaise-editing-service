import { Accordion, ONSPanel } from 'blaise-design-system-react-components';
import { ExpandableContent } from 'blaise-design-system-react-components/build/src/components/Accordion';
import { ReactElement } from 'react';
import { User } from 'blaise-api-node-client';
import { Survey } from '../../../common/interfaces/surveyInterface';
import EditorsQuestionnaireList from '../../Editor/Components/EditorsQuestionnairesList';
import ManagersQuestionnairesList from '../../Manager/Components/ManagersQuestionnairesList';
import UserRole from '../enums/UserRole';

interface SurveysListProps {
  surveys: Survey[]
  user: User;
}

function CreateContent(surveys:Survey[], user: User):ExpandableContent[] {
  const userRole:UserRole = UserRole[user.role as UserRole];
  return userRole === UserRole.Manager
    ? surveys.map(({ name, questionnaires }) => ({ title: name, content: <ManagersQuestionnairesList questionnaires={questionnaires} /> }))
    : surveys.map(({ name, questionnaires }) => ({ title: name, content: <EditorsQuestionnaireList questionnaires={questionnaires} /> }));
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
      <Accordion ShowAllEnabled Expandables={CreateContent(surveys, user)} />
    </>
  );
}
