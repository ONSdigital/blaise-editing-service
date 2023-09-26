import { useParams } from 'react-router-dom';
import { useAsyncRequestWithTwoParams } from '../hooks/useAsyncRequest';
import { CaseFactsheetDetails } from '../../common/interfaces/caseInterface';
import AsyncContent from '../components/AsyncContent';
import FactsheetContent from '../components/FactsheetContent';
import { getCaseFactsheet } from '../api/NodeApi';

function DisplayCaseFactsheet(questionnaireName: string, caseId: string) {
  const caseFactsheet = useAsyncRequestWithTwoParams<CaseFactsheetDetails, string, string>(getCaseFactsheet, questionnaireName, caseId);

  return (
    <div data-testid="Factsheet">
      <AsyncContent content={caseFactsheet}>
        {(factsheetContent) => <FactsheetContent factsheet={factsheetContent} />}
      </AsyncContent>
    </div>
  );
}

export type CaseFactSheetParams = {
  questionnaireName: string
  caseId: string
};

export default function CaseFactSheet() {
  const { questionnaireName, caseId } = useParams<keyof CaseFactSheetParams>() as CaseFactSheetParams;

  return DisplayCaseFactsheet(questionnaireName, caseId);
}
