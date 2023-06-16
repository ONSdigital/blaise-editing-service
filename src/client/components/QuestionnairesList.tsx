import { Questionnaire } from 'blaise-api-node-client';

interface QuestionnairesListProps {
  questionnaires: Questionnaire[];
}

export default function QuestionnairesList({ questionnaires }: QuestionnairesListProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {questionnaires.map((questionnaire) => (
          <tr key={questionnaire.name}>
            <td>{questionnaire.name}</td>
            <td>{questionnaire.serverParkName}</td>
            <td>{questionnaire.dataRecordCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
