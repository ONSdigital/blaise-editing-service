import { User } from 'blaise-api-node-client';
import { Survey } from '../../../common/interfaces/surveyInterface';
import { useAsyncRequestWithParam } from '../../Common/hooks/useAsyncRequest';
import { getSurveys } from '../../api/NodeApi';
import AsyncContent from '../../Common/components/AsyncContent';
import SurveysList from '../../Common/components/SurveysList';
import ErrorPanel from '../../Common/components/ErrorPanel';

interface SurveyProps {
  user: User;
}

export default function SupportHome({ user }: SurveyProps) {
  const surveys = useAsyncRequestWithParam<Survey[], string>(getSurveys, user.role);
  const params = new URLSearchParams(window.location.search);
  const error = params.get('error') ?? '';

  return (
    <div data-testid="Surveys">
      {error != null && error.length > 0 && <ErrorPanel message={error} />}
      <AsyncContent content={surveys}>
        {(loadedSurveys) => <SurveysList surveys={loadedSurveys} user={user} />}
      </AsyncContent>
    </div>
  );
}
