import { User } from 'blaise-api-node-client';
import { Survey } from '../../../common/interfaces/surveyInterface';
import { useAsyncRequestWithParam } from '../../utils/useAsyncRequest';
import { getSurveys } from '../../api/NodeApi';
import AsyncContent from '../shared/AsyncContent';
import SurveysList from '../shared/SurveysList';
import ErrorPanel from '../shared/ErrorPanel';

interface SurveyProps {
  user: User;
}

export default function ResearchHome({ user }: SurveyProps) {
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
