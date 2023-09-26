import { useParams } from 'react-router-dom';
import { ReactElement } from 'react';
import AsyncContent from '../components/AsyncContent';
import CasesList from '../components/CasesList';
import { useAsyncRequestWithParam } from '../hooks/useAsyncRequest';
import { CaseDetails } from '../../common/interfaces/caseInterface';
import { getCases } from '../api/NodeApi';

function DisplayCases(questionnaireName: string) {
  const cases = useAsyncRequestWithParam<CaseDetails[], string>(getCases, questionnaireName);

  return (
    <div data-testid="Cases">
      <AsyncContent content={cases}>
        {(loadedCases) => <CasesList cases={loadedCases} />}
      </AsyncContent>
    </div>
  );
}

export type CasesParams = {
  questionnaireName: string
};

export default function Cases(): ReactElement {
  const { questionnaireName } = useParams<keyof CasesParams>() as CasesParams;

  return DisplayCases(questionnaireName);
}
