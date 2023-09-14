import { ONSPanel, ONSTable } from 'blaise-design-system-react-components';
import { Link } from 'react-router-dom';
import { ReactElement } from 'react';
import { CaseDetails } from '../../common/interfaces/caseInterface';

interface CasesListProps {
  cases: CaseDetails[];
}

export default function CasesList({ cases }: CasesListProps) : ReactElement {
  if (cases.length === 0) {
    return <ONSPanel spacious status="info">There are no cases available</ONSPanel>;
  }
  return (
    <>
      <ONSPanel spacious status="info">
        These cases are allocated to you for questionnire
        {' '}
        {cases[0]?.QuestionnaireName}
      </ONSPanel>
      <div style={{ margin: '2rem 0 0 0' }}>
        <ONSTable
          tableID="case-table"
          columns={[
            'Case',
            'Status',
            'Factsheet',
          ]}
        >
          <>
            {cases.map((questionnaireCase, caseIndex) => (
              <tr key={questionnaireCase.CaseId} className="ons-table__row" data-testid={`case-table-row${caseIndex}`}>
                <td className="ons-table__cell">
                  <Link to={questionnaireCase.CaseLink}>
                    {questionnaireCase.CaseId}
                  </Link>
                </td>
                <td className="ons-table__cell">{questionnaireCase.CaseStatus}</td>
                <td className="ons-table__cell">
                  <Link to={`/questionnaires/${questionnaireCase.QuestionnaireName}/cases/${questionnaireCase.CaseId}/factsheet`}>Factsheet</Link>
                </td>
              </tr>
            ))}
          </>
        </ONSTable>
      </div>
    </>
  );
}
