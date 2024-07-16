import { ONSPanel } from 'blaise-design-system-react-components';
import { User } from 'blaise-api-node-client';
import { Survey } from '../../../common/interfaces/surveyInterface';
import { useAsyncRequest } from '../../Common/hooks/useAsyncRequest';
import getSurveys from '../../Common/api/NodeApi';
import AsyncContent from '../../Common/components/AsyncContent';
import SupervisorsSurveysList from '../Components/SupervisorsSurveysList';

interface SurveyProps {
  user: User;
}

export default function SupervisorsHome({ user }: SurveyProps) {
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
          {(loadedSurveys) => <SupervisorsSurveysList surveys={loadedSurveys} />}
        </AsyncContent>
      </div>
    </>
  );
}
