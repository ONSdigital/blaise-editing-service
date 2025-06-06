import { User } from 'blaise-api-node-client';
import AsyncContent from '../../Common/components/AsyncContent';
import { Survey } from '../../../common/interfaces/surveyInterface';
import { getSurveys } from '../../api/NodeApi';
import { useAsyncRequestWithParam } from '../../Common/hooks/useAsyncRequest';
import SurveysList from '../../Common/components/SurveysList';
import ErrorPanel from '../../Common/components/ErrorPanel';

interface SurveyProps {
  user: User;
}

export default function Surveys({ user }: SurveyProps) {
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
