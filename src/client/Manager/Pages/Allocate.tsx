import { useParams, useSearchParams } from 'react-router-dom';
import { AllocationDetails } from '../../../common/interfaces/surveyInterface';
import { getAllocationDetails } from '../../Common/api/NodeApi';
import { useAsyncRequestWithParam } from '../../Common/hooks/useAsyncRequest';
import AsyncContent from '../../Common/components/AsyncContent';
import AllocateCases from '../Components/AllocateCases';

function DisplayAllocation(questionnaireName:string, userName:string) {
  const allocationDetails = useAsyncRequestWithParam<AllocationDetails, string>(getAllocationDetails, questionnaireName);

  return (
    <div data-testid="Allocate">
      <AsyncContent content={allocationDetails}>
        {(loadedAllocationDetails) => <AllocateCases questionnaireName={questionnaireName} userName={userName} allocationDetails={loadedAllocationDetails} />}
      </AsyncContent>
    </div>
  );
}

export type AllocateParams = {
  questionnaireName: string
};

export default function Allocate() {
  const { questionnaireName } = useParams<keyof AllocateParams>() as AllocateParams;

  const [searchParams] = useSearchParams();
  const userName = searchParams.get('userName');

  return DisplayAllocation(questionnaireName, userName ?? '');
}
