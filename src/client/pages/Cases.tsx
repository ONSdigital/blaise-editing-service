import { CaseStatus } from 'blaise-api-node-client';
import { useParams } from 'react-router-dom';
import { getCaseStatuses } from '../api/questionnaires';
import AsyncContent from '../components/AsyncContent';
import CasesList from '../components/CasesList';
import { useAsyncRequestWithParams } from '../hooks/useAsyncRequest';

function DisplayCases(questionnaireName:string) {
  const cases = useAsyncRequestWithParams<CaseStatus[]>(getCaseStatuses, questionnaireName);

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
