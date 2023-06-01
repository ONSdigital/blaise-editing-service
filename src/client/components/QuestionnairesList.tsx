import Questionnaire from '../../shared/models/Questionnaire';

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
          </tr>
        ))}
      </tbody>
    </table>
  );
}
