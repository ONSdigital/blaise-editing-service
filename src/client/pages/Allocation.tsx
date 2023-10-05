import { useParams } from 'react-router-dom';
import { AllocationDetails } from '../../common/interfaces/surveyInterface';
import { getAllocationDetails } from '../api/NodeApi';
import { useAsyncRequestWithParam } from '../hooks/useAsyncRequest';
import AsyncContent from '../components/AsyncContent';
import QuestionnaireAllocation from '../components/QuestionnaireAllocation';

function DisplayAllocation(questionnaireName:string) {
  const allocationDetails = useAsyncRequestWithParam<AllocationDetails, string>(getAllocationDetails, questionnaireName);

  return (
    <div data-testid="Allocation">
      <AsyncContent content={allocationDetails}>
        {(loadedAllocationDetails) => <QuestionnaireAllocation questionnaireName={questionnaireName} allocationDetails={loadedAllocationDetails} />}
      </AsyncContent>
    </div>
  );
}

export type AllocationParams = {
  questionnaireName: string
};

export default function Allocation() {
  const { questionnaireName } = useParams<keyof AllocationParams>() as AllocationParams;

  return DisplayAllocation(questionnaireName);
}
