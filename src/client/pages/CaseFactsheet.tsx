import { useParams } from 'react-router-dom';
import { useAsyncRequestWithTwoParams } from '../hooks/useAsyncRequest';
import { CaseFactsheetDetails } from '../../common/interfaces/caseInterface';
import { getCaseFactsheet } from '../clients/serverApi';
import AsyncContent from '../components/AsyncContent';
import FactsheetContent from '../components/FactsheetContent';

function DisplayCaseFactsheet(questionnaireName: string, caseId: string) {
  const caseFactsheet = useAsyncRequestWithTwoParams<CaseFactsheetDetails>(getCaseFactsheet, questionnaireName, caseId);

  return (
    <AsyncContent content={caseFactsheet}>
      {(factsheetContent) => <FactsheetContent factsheet={factsheetContent} />}
    </AsyncContent>
  );
}

export default function CaseFactSheet() {
  const { questionnaireName, caseId } = useParams();
  if (!questionnaireName || !caseId) {
    return (
      <div>
        questionnaire name or caseId not provided
      </div>
    );
  }

  return DisplayCaseFactsheet(questionnaireName, caseId);
}
