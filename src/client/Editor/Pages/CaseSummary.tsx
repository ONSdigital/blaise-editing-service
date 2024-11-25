import { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import CaseSummaryContent from '../Components/CaseSummaryContent';
import { CaseSummaryDetails } from '../../../common/interfaces/caseInterface';
import { CaseSummaryParams } from '../../Common/types/CaseSummaryParams';
import AsyncContent from '../../Common/components/AsyncContent';
import { useAsyncRequestWithTwoParams } from '../../Common/hooks/useAsyncRequest';
import { getCaseSummary } from '../../api/NodeApi';

function DisplayCaseSummary(questionnaireName: string, caseId: string) {
  const caseSummary = useAsyncRequestWithTwoParams<CaseSummaryDetails, string, string>(getCaseSummary, questionnaireName, caseId);

  return (
    <div data-testid="Summary">
      <AsyncContent content={caseSummary}>
        {(caseSummaryContent) => <CaseSummaryContent caseSummary={caseSummaryContent} />}
      </AsyncContent>

    </div>
  );
}
export default function CaseSummary(): ReactElement {
  const { questionnaireName, caseId } = useParams<keyof CaseSummaryParams>() as CaseSummaryParams;

  return DisplayCaseSummary(questionnaireName, caseId);
}
