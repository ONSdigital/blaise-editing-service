import { ONSPanel, ONSTable } from 'blaise-design-system-react-components';
import { Link } from 'react-router-dom';
import { ICaseDetails } from '../../server/interfaces/case.details.interface';

interface CasesListProps {
  cases: ICaseDetails[];
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
      ]}
    >
      <>
        {cases.map((questionnaireCase) => (
          <tr className="ons-table__row" data-testid="case-table-row">
            <td className="ons-table__cell">
              <Link to={questionnaireCase.CaseLink}>
                {questionnaireCase.CaseId}
              </Link>
            </td>
            <td className="ons-table__cell">{questionnaireCase.CaseStatus}</td>
          </tr>
        ))}
      </>
    </ONSTable>
  );
}
