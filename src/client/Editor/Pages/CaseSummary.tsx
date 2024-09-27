import { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
// import { getCaseSummary } from '../../api/NodeApi';
// import { useAsyncRequestWithTwoParams } from '../../Common/hooks/useAsyncRequest';
// import AsyncContent from '../../Common/components/AsyncContent';
// import { CaseSummaryDetails } from '../../../common/interfaces/caseInterface';
import CaseSummaryContent from '../Components/CaseSummaryContent';
import { CaseSummaryDetails } from '../../../common/interfaces/caseInterface';

function DisplayCaseSummary(questionnaireName: string, caseId: string) {
  // const caseSummary = useAsyncRequestWithTwoParams<CaseSummaryDetails, string, string>(getCaseSummary, questionnaireName, caseId);
  console.log(questionnaireName, caseId);
  const caseSummaryDetailsMockObject: CaseSummaryDetails = {
    CaseId: '9001',
    OutcomeCode: '110',
    InterviewDate: new Date('2024-05-11'),
    District: 'Gwent',
    InterviewerName: 'Rich',
    NumberOfRespondents: '2',
    Household: {
      Accommodation: {
        Main: 'House/Bungalow',
        Type: 'Detached',
      },
      FloorNumber: '2',
      Status: 'Conventional',
      NumberOfBedrooms: '2',
      ReceiptOfHousingBenefit: '380',
      PeriodCode: '380',
      CouncilTaxBand: 'Band A',
      BusinessRoom: true,
      SelfEmployed: true,
      SelfEmployedMembers: ['1'],
      IncomeSupport: true,
      IncomeSupportMembers: ['1'],
      IncomeBasedJaSupport: true,
      IncomeBasedJaSupportMembers: ['2'],
    },
    Respondents: [
      {
        RespondentName: 'Richmond Ricecake',
        DateOfBirth: new Date('1980-01-15'),
      },
      {
        RespondentName: 'Bartholomew Edgar',
        DateOfBirth: new Date('1995-06-11'),
      },
    ],
  };

  return (
    <div data-testid="Summary">
      {/*       <AsyncContent content={caseSummary}>
        {(caseSummaryContent) => <CaseSummaryContent caseSummary={caseSummaryContent} />}
      </AsyncContent> */}

      <CaseSummaryContent caseSummary={caseSummaryDetailsMockObject} />
    </div>
  );
}

export type CaseSummaryParams = {
  questionnaireName: string
  caseId: string
};

export default function CaseSummary(): ReactElement {
  const { questionnaireName, caseId } = useParams<keyof CaseSummaryParams>() as CaseSummaryParams;

  return DisplayCaseSummary(questionnaireName, caseId);
}
