import { ReactElement } from 'react';
import { QuestionnaireDetails } from '../../../common/interfaces/surveyInterface';
import { useAsyncRequestWithParam } from '../../Common/hooks/useAsyncRequest';
import { getSupervisorEditorInformation } from '../../api/NodeApi';
import AsyncContent from '../../Common/components/AsyncContent';
import { SupervisorInformation } from '../../Interfaces/supervisorInterface';
import SupervisorContent from './SupervisorContent';

interface SupervisorQuestionnairesDetailsProps {
  questionnaire: QuestionnaireDetails;
}

export default function SupervisorQuestionnairesDetails({ questionnaire }: SupervisorQuestionnairesDetailsProps): ReactElement {
  const supervisorInformation = useAsyncRequestWithParam<SupervisorInformation, string>(getSupervisorEditorInformation, questionnaire.questionnaireName);

  return (

    <div className="questionnaire" data-testid="questionnaire">
      <AsyncContent content={supervisorInformation}>
        {(loadedSupervisorInformation) => <SupervisorContent supervisorInformation={loadedSupervisorInformation} questionnaire={questionnaire} />}
      </AsyncContent>
    </div>
  );
}
