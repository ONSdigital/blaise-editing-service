import getQuestionnaires from '../api/questionnaires';
import { GetQuestionnaires } from '../../shared/responses/GetQuestionnaires';
import QuestionnairesList from '../components/QuestionnairesList';
import AsyncContent from '../components/AsyncContent';
import { useAsyncRequest } from '../hooks/useAsyncRequest';

export default function Questionnaires() {
  const questionnaires = useAsyncRequest<GetQuestionnaires>(getQuestionnaires);

  return (
    <div>
      <AsyncContent content={questionnaires}>
        {(loadedQuestionnaires) => <QuestionnairesList questionnaires={loadedQuestionnaires} />}
      </AsyncContent>
    </div>
  );
}
