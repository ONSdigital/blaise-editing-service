import { ReactElement } from 'react';
import { QuestionnaireDetails } from '../../../common/interfaces/surveyInterface';
import { useAsyncRequestWithThreeParams } from '../../Common/hooks/useAsyncRequest';
import { getEditorInformation } from '../../api/NodeApi';
import AsyncContent from '../../Common/components/AsyncContent';
import EditorContent from './EditorContent';
import { EditorInformation } from '../../types/editorInterface';
import UserRole from '../../types/UserTypes';

interface EditorQuestionnairesDetailsProps {
  questionnaire: QuestionnaireDetails;
  username: string;
  editorRole: UserRole;
}

export default function EditorQuestionnairesDetails({ questionnaire, username, editorRole }: EditorQuestionnairesDetailsProps): ReactElement {
  const editorInformation = useAsyncRequestWithThreeParams<EditorInformation, string, string, UserRole>(getEditorInformation, questionnaire.questionnaireName, username, editorRole);

  return (

    <div className="questionnaire" data-testid="questionnaire">
      <AsyncContent content={editorInformation}>
        {(loadedEditorInformation) => <EditorContent editorInformation={loadedEditorInformation} questionnaire={questionnaire} />}
      </AsyncContent>
    </div>
  );
}
