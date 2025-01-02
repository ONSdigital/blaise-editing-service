import { ONSPanel } from 'blaise-design-system-react-components';
import { User } from 'blaise-api-node-client';
import { Survey } from '../../../common/interfaces/surveyInterface';
import { useAsyncRequestWithParam } from '../../Common/hooks/useAsyncRequest';
import { getSurveys } from '../../api/NodeApi';
import AsyncContent from '../../Common/components/AsyncContent';
import SurveysList from '../../Common/components/SurveysList';

interface SurveyProps {
  user: User;
}

export default function SupportHome({ user }: SurveyProps) {
  const surveys = useAsyncRequestWithParam<Survey[], string>(getSurveys, user.role);

  return (
    <>
      <ONSPanel status="info">
        Welcome to the editing service.
      </ONSPanel>
      <div data-testid="Surveys">
        <AsyncContent content={surveys}>
          {(loadedSurveys) => <SurveysList surveys={loadedSurveys} user={user} />}
        </AsyncContent>
      </div>
    </>
  );
}