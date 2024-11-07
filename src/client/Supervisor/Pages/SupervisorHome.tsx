import { ONSPanel } from 'blaise-design-system-react-components';
import { Survey } from '../../../common/interfaces/surveyInterface';
import { getSurveys } from '../../api/NodeApi';
import AsyncContent from '../../Common/components/AsyncContent';
import SurveysList from '../../Common/components/SurveysList';
import { useAsyncRequest } from '../../Common/hooks/useAsyncRequest';

export default function SupervisorHome() {
  // TODO: maybe filter surveys returned here - pass user details to node and bring back full list or filtered
  const surveys = useAsyncRequest<Survey[]>(getSurveys);
  console.log("DEBUG: Fetched surveys data:", surveys);

  return (
    <>
      <ONSPanel status="info">
        Welcome to the editing service.
      </ONSPanel>
      <div data-testid="Surveys">
        <AsyncContent content={surveys}>
          {(loadedSurveys) => {
            console.log("DEBUG: Surveys to be displayed in SurveysList:", loadedSurveys);
            return <SurveysList surveys={loadedSurveys} />;
          }}
        </AsyncContent>
      </div>
    </>
  );
}
