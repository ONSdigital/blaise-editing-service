import { ONSPanel } from 'blaise-design-system-react-components';
import { User } from 'blaise-api-node-client';
import AsyncContent from '../../Common/components/AsyncContent';
import { Survey } from '../../../common/interfaces/surveyInterface';
import getSurveys from '../../Common/api/NodeApi';
import { useAsyncRequest } from '../../Common/hooks/useAsyncRequest';
import SurveysList from '../../Common/components/SurveysList';

interface SurveyProps {
  user: User;
}

export default function Surveys({ user }: SurveyProps) {
  // TODO: maybe filter surveys returned here - pass user details to node and bring back full list or filtered
  const surveys = useAsyncRequest<Survey []>(getSurveys);

  return (
    <>
      <ONSPanel status="info">
        Welcome to the editing service.
      </ONSPanel>
      <div data-testid="Surveys">
        <AsyncContent content={surveys}>
          {(loadedSurveys) => <SurveysList surveys={loadedSurveys} role={user.role} />}
        </AsyncContent>
      </div>
    </>
  );
}
