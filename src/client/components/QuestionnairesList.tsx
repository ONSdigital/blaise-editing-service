import { Questionnaire } from 'blaise-api-node-client';
import { ONSPanel, ONSTable } from 'blaise-design-system-react-components';
import { Link } from 'react-router-dom';

interface QuestionnairesListProps {
  questionnaires: Questionnaire[];
}

export default function QuestionnairesList({ questionnaires }: QuestionnairesListProps) {
  if (questionnaires.length === 0) {
    return (
      <ONSPanel spacious status="info">There are no questionnaires available</ONSPanel>
    );
  }
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
          <tr key={questionnaire.name} className="ons-table__row" data-testid="questionnaire-table-row">
            <td className="ons-table__cell"><Link to={`/questionnaires/${questionnaire.name}/cases`}>{questionnaire.name}</Link></td>
            <td className="ons-table__cell">{questionnaire.serverParkName}</td>
            <td className="ons-table__cell">{questionnaire.dataRecordCount}</td>
          </tr>
        ))}
      </>
    </ONSTable>
  );
}
