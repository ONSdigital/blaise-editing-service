import { ICaseStatus } from 'blaise-api-node-client';
import { useParams } from 'react-router-dom';
import { getStatusOfCases } from '../api/blaiseApi';
import AsyncContent from '../components/AsyncContent';
import CasesList from '../components/CasesList';
import { useAsyncRequestWithParams } from '../hooks/useAsyncRequest';

function DisplayCases(questionnaireName:string) {
  const cases = useAsyncRequestWithParams<ICaseStatus[]>(getStatusOfCases, questionnaireName);

  return (
    <AsyncContent content={cases}>
      {(loadedCases) => <CasesList cases={loadedCases} questionnaireName={questionnaireName} />}
    </AsyncContent>
  );
}

export default function Cases() {
  const { questionnaireName } = useParams();
  if (!questionnaireName) {
    return (
      <div>
        No questionnaire name
      </div>
    );
  }

  return DisplayCases(questionnaireName);
}
