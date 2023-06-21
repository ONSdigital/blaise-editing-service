import { CaseStatus } from 'blaise-api-node-client';
import { ONSTable } from 'blaise-design-system-react-components';

interface CasesListProps {
  cases: CaseStatus[];
}

export default function CasesList({ cases }: CasesListProps) {
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
            <td className="ons-table__cell">{questionnaireCase.primaryKey}</td>
            <td className="ons-table__cell">{questionnaireCase.outcome}</td>
          </tr>
        ))}
      </>
    </ONSTable>
  );
}
