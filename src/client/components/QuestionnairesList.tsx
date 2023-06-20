import { Questionnaire } from 'blaise-api-node-client';
import { ONSTable } from 'blaise-design-system-react-components';

interface QuestionnairesListProps {
  questionnaires: Questionnaire[];
}

export default function QuestionnairesList({ questionnaires }: QuestionnairesListProps) {
  return (
    <ONSTable
      tableID="questionnaire-table"
      columns={[
        'Questionnaire name',
        'Server park',
        'Number of cases',
      ]}
    >
      <>
        {questionnaires.map((questionnaire) => (
          <tr className="ons-table__row" data-testid="questionnaire-table-row">
            <td className="ons-table__cell">{questionnaire.name}</td>
            <td className="ons-table__cell">{questionnaire.serverParkName}</td>
            <td className="ons-table__cell">{questionnaire.dataRecordCount}</td>
          </tr>
        ))}
      </>
    </ONSTable>
  );
}
