import { useParams } from 'react-router-dom';
import { getCases } from '../api/blaiseApi';
import AsyncContent from '../components/AsyncContent';
import CasesList from '../components/CasesList';
import { useAsyncRequestWithParams } from '../hooks/useAsyncRequest';
import { ICaseDetails } from '../../server/interfaces/case.details.interface';

function DisplayCases(questionnaireName: string) {
  const cases = useAsyncRequestWithParams<ICaseDetails[]>(getCases, questionnaireName);

  return (
    <AsyncContent content={cases}>
      {(loadedCases) => <CasesList cases={loadedCases} />}
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
