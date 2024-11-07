import { ONSPanel } from 'blaise-design-system-react-components';
import { Survey } from '../../../common/interfaces/surveyInterface';
import { getSurveys } from '../../api/NodeApi';
import AsyncContent from '../../Common/components/AsyncContent';
import SurveysList from '../../Common/components/SurveysList';
import { useAsyncRequest } from '../../Common/hooks/useAsyncRequest';

export default function SupervisorHome() {
  // TODO: maybe filter surveys returned here - pass user details to node and bring back full list or filtered
  console.log('SupervisorHome');
  const surveys = useAsyncRequest<Survey[]>(getSurveys);

  return (
    <>
      <ONSPanel status="info">
        Welcome to the editing service.
      </ONSPanel>
      <div data-testid="Surveys">
        <AsyncContent content={surveys}>
          {(loadedSurveys) => <SurveysList surveys={loadedSurveys} />}
        </AsyncContent>
      </div>
    </>
  );
}
