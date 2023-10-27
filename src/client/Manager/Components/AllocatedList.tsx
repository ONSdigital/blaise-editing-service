import {
  Accordion, ONSPanel,
} from 'blaise-design-system-react-components';
import { ExpandableContent } from 'blaise-design-system-react-components/build/src/components/Accordion';
import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import EditorAllocation from './EditorAllocation';
import { AllocationDetails, EditorAllocationDetails } from '../../../common/interfaces/surveyInterface';

function CreateAllocatedListContent(questionnaireName: string, allocation: EditorAllocationDetails[]):ExpandableContent[] {
  return allocation.map(({ editor, cases }) => ({ title: editor, content: <EditorAllocation cases={cases} editor={editor} questionnaireName={questionnaireName} /> }));
}

interface AllocatedListProps {
  questionnaireName: string;
  allocationDetails: AllocationDetails
}

export default function AllocatedList({ questionnaireName, allocationDetails }: AllocatedListProps): ReactElement {
  return (
    <>
      <Link to={`/questionnaires/${questionnaireName}/allocation/allocate`} style={{ fontWeight: 'normal' }}>
        Allocate editors to
        {' '}
        {questionnaireName}
      </Link>

      <ONSPanel spacious status="info" testID="info-panel">
        There are
        {' '}
        {allocationDetails.numberOfCases - allocationDetails.numberOfCasesAllocated}
        {' '}
        cases left to allocate for
        {' '}
        {questionnaireName}
      </ONSPanel>

      <br />
      <h3>Currently allocated</h3>
      <Accordion Expandables={CreateAllocatedListContent(questionnaireName, allocationDetails.editorAllocationDetails)} />
      <br />
    </>
  );
}
