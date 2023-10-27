import { useParams } from 'react-router-dom';
import { AllocationDetails } from '../../../common/interfaces/surveyInterface';
import { getAllocationDetails } from '../../Common/api/NodeApi';
import { useAsyncRequestWithParam } from '../../Common/hooks/useAsyncRequest';
import AsyncContent from '../../Common/components/AsyncContent';
import AllocatedList from '../Components/AllocatedList';

function DisplayAllocation(questionnaireName:string) {
  const allocationDetails = useAsyncRequestWithParam<AllocationDetails, string>(getAllocationDetails, questionnaireName);

  return (
    <div data-testid="Allocate">
      <AsyncContent content={allocationDetails}>
        {(loadedAllocationDetails) => <AllocatedList questionnaireName={questionnaireName} allocationDetails={loadedAllocationDetails} />}
      </AsyncContent>
    </div>
  );
}

export type AllocateParams = {
  questionnaireName: string
};

export default function Allocate() {
  const { questionnaireName } = useParams<keyof AllocateParams>() as AllocateParams;

  return DisplayAllocation(questionnaireName);
}
