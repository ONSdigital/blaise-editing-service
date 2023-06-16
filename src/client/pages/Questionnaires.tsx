import { Questionnaire } from 'blaise-api-node-client';
import getQuestionnaires from '../api/questionnaires';
import QuestionnairesList from '../components/QuestionnairesList';
import AsyncContent from '../components/AsyncContent';
import { useAsyncRequest } from '../hooks/useAsyncRequest';

export default function Questionnaires() {
  const questionnaires = useAsyncRequest<Questionnaire []>(getQuestionnaires);

  return (
    <div>
      <AsyncContent content={questionnaires}>
        {(loadedQuestionnaires) => <QuestionnairesList questionnaires={loadedQuestionnaires} />}
      </AsyncContent>
    </div>
  );
}