import { useParams } from 'react-router-dom';
import { getCases } from '../api/blaiseApi';
import AsyncContent from '../components/AsyncContent';
import CasesList from '../components/CasesList';
import { useAsyncRequestWithParam } from '../hooks/useAsyncRequest';
import { CaseDetails } from '../../common/interfaces/caseInterface';

function DisplayCases(questionnaireName: string) {
  const cases = useAsyncRequestWithParam<CaseDetails[]>(getCases, questionnaireName);

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
