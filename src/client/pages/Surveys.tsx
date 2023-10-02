import { ONSPanel } from 'blaise-design-system-react-components';
import { User } from 'blaise-api-node-client';
import AsyncContent from '../components/AsyncContent';
import { useAsyncRequest } from '../hooks/useAsyncRequest';
import { Survey } from '../../common/interfaces/surveyInterface';
import SurveysList from '../components/SurveysList';
import { getSurveys } from '../api/NodeApi';

interface SurveyProps {
  user: User;
}

export default function Surveys({ user }: SurveyProps) {
  const infoPanelMessage = `Bonjour tout le monde ${user.name}`;

  // TODO: maybe filter surveys returned here - pass user details to node and bring back full list or filtered
  const surveys = useAsyncRequest<Survey []>(getSurveys);

  return (
    <>
      <ONSPanel status="info">
        {infoPanelMessage}
      </ONSPanel>
      <div data-testid="Surveys">
        <AsyncContent content={surveys}>
          {(loadedSurveys) => <SurveysList surveys={loadedSurveys} user={user} />}
        </AsyncContent>
      </div>
    </>
  );
}
