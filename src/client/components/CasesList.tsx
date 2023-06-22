import { CaseStatus } from 'blaise-api-node-client';
import { ONSTable } from 'blaise-design-system-react-components';
import { Link } from 'react-router-dom';

interface CasesListProps {
  cases: CaseStatus[];
  questionnaireName: string;
}

export default function CasesList({ cases, questionnaireName }: CasesListProps) {
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
<td className="ons-table__cell"><Link to={`https://dev-cati.social-surveys.gcp.onsdigital.uk/${questionnaireName}/?Mode=CAWI&KeyValue=${questionnaireCase.primaryKey
}`}>{questionnaireCase.primaryKey}</Link>{questionnaireCase.primaryKey}</td>
            
            <td className="ons-table__cell">{questionnaireCase.outcome}</td>
          </tr>
        ))}
      </>
    </ONSTable>
  );
}
