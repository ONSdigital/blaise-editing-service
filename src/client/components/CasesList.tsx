import { ONSPanel, ONSTable } from 'blaise-design-system-react-components';
import { Link } from 'react-router-dom';
import { CaseDetails } from '../../common/interfaces/caseInterface';

interface CasesListProps {
  cases: CaseDetails[];
}

export default function CasesList({ cases }: CasesListProps) {
  if (cases.length === 0) {
    return <ONSPanel spacious status="info">There are no cases available</ONSPanel>;
  }
  return (
    <ONSTable
      tableID="case-table"
      columns={[
        'Case ID',
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
  );
}
