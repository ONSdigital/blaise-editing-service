import { ReactElement } from 'react';
import { QuestionnaireDetails } from '../../../common/interfaces/surveyInterface';
import { useAsyncRequestWithParam } from '../../Common/hooks/useAsyncRequest';
import { getEditorInformation } from '../../api/NodeApi';
import AsyncContent from '../../Common/components/AsyncContent';
import EditorContent from './EditorContent';
import { EditorInformation } from '../../Interfaces/editorInterface';

interface EditorQuestionnairesDetailsProps {
  questionnaire: QuestionnaireDetails;
}

export default function EditorQuestionnairesDetails({ questionnaire }: EditorQuestionnairesDetailsProps): ReactElement {
  const editorInformation = useAsyncRequestWithParam<EditorInformation, string>(getEditorInformation, questionnaire.questionnaireName);

  return (

    <div className="questionnaire" data-testid="questionnaire">
      <AsyncContent content={editorInformation}>
        {(loadedEditorInformation) => <EditorContent editorInformation={loadedEditorInformation} questionnaire={questionnaire} />}
      </AsyncContent>
    </div>
  );
}
