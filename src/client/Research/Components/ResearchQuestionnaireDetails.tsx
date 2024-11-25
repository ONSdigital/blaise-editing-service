import { ReactElement } from 'react';
import { QuestionnaireDetails } from '../../../common/interfaces/surveyInterface';
import ResearchContent from './ResearchContent';

interface ResearchQuestionnairesDetailsProps {
  questionnaire: QuestionnaireDetails;
}

export default function ResearchQuestionnairesDetails({ questionnaire }: ResearchQuestionnairesDetailsProps): ReactElement {
  return (

    <div className="questionnaire" data-testid="questionnaire">
      <ResearchContent questionnaire={questionnaire} />
    </div>
  );
}
