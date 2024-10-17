import { ReactElement } from 'react';
import { QuestionnaireDetails } from '../../../common/interfaces/surveyInterface';
import { useAsyncRequestWithThreeParams } from '../../Common/hooks/useAsyncRequest';
import { getSupervisorEditorInformation } from '../../api/NodeApi';
import AsyncContent from '../../Common/components/AsyncContent';
import { SupervisorInformation } from '../../Interfaces/supervisorInterface';
import SupervisorContent from './SupervisorContent';
import UserRole from '../../Common/enums/UserTypes';

interface SupervisorQuestionnairesDetailsProps {
  questionnaire: QuestionnaireDetails;
  supervisorRole: UserRole;
  editorRole: UserRole;
}

export default function SupervisorQuestionnairesDetails({ questionnaire, supervisorRole, editorRole }: SupervisorQuestionnairesDetailsProps): ReactElement {
  const supervisorInformation = useAsyncRequestWithThreeParams<SupervisorInformation, string, UserRole, UserRole>(getSupervisorEditorInformation, questionnaire.questionnaireName, supervisorRole, editorRole);

  return (

    <div className="questionnaire" data-testid="questionnaire">
      <AsyncContent content={supervisorInformation}>
        {(loadedSupervisorInformation) => <SupervisorContent supervisorInformation={loadedSupervisorInformation} questionnaire={questionnaire} />}
      </AsyncContent>
    </div>
  );
}
