import { ReactElement } from 'react';
import { QuestionnaireDetails } from '../../../common/interfaces/surveyInterface';
import SupportContent from './SupportContent';

interface SupportQuestionnairesDetailsProps {
  questionnaire: QuestionnaireDetails;
}

export default function SupportQuestionnairesDetails({ questionnaire }: SupportQuestionnairesDetailsProps): ReactElement {
  return (

    <div className="questionnaire" data-testid="questionnaire">
      <SupportContent questionnaire={questionnaire} />
    </div>
  );
}
