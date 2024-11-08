import { ONSPanel } from 'blaise-design-system-react-components';
import { User } from 'blaise-api-node-client';
import AsyncContent from '../../Common/components/AsyncContent';
import { Survey } from '../../../common/interfaces/surveyInterface';
import { getSurveys } from '../../api/NodeApi';
import { useAsyncRequestWithParam } from '../../Common/hooks/useAsyncRequest';
import SurveysList from '../../Common/components/SurveysList';

interface SurveyProps {
  user: User;
}

export default function Surveys({ user }: SurveyProps) {
  // TODO: maybe filter surveys returned here - pass user details to node and bring back full list or filtered
  const surveys = useAsyncRequestWithParam<Survey[], string>(getSurveys, user.role);

  return (
    <>
      <ONSPanel status="info">
        The following questionnaires are for training purposes only.
      </ONSPanel>
      <div data-testid="Surveys">
        <AsyncContent content={surveys}>
          {(loadedSurveys) => <SurveysList surveys={loadedSurveys} />}
        </AsyncContent>
      </div>
    </>
  );
}
