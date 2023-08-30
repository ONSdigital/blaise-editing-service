import { ONSPanel } from 'blaise-design-system-react-components';
import AsyncContent from '../components/AsyncContent';
import { useAsyncRequest } from '../hooks/useAsyncRequest';
import { getSurveys } from '../clients/serverApi';
import { Survey } from '../../common/interfaces/surveyInterface';
import SurveysList from '../components/SurveysList';

export default function Surveys() {
  const surveys = useAsyncRequest<Survey []>(getSurveys);

  return (
    <>
      <ONSPanel status="info">Bonjour tout le monde</ONSPanel>
      <AsyncContent content={surveys}>
        {(loadedSurveys) => <SurveysList surveys={loadedSurveys} />}
      </AsyncContent>
    </>
  );
}
