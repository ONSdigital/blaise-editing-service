import { Accordion } from 'blaise-design-system-react-components';
import { ExpandableContent } from 'blaise-design-system-react-components/build/src/components/Accordion';
import { ReactElement } from 'react';
import { AllocationDetails } from '../../common/interfaces/questionnaireAllocationInterface';
import questionnaireAllocationMockObject from '../../test/mockObjects/questionnaireAllocationMockObject';
import EditorAllocation from './EditorAllocation';

function CreateAllocationContent(allocation: AllocationDetails[]):ExpandableContent[] {
  return allocation.map(({ editor, cases }) => ({ title: editor, content: <EditorAllocation cases={cases} /> }));
}

export default function QuestionnaireAllocation(): ReactElement {
  const questionnaireAllocationDetails = questionnaireAllocationMockObject;
  return (
    <>
      <br />
      <h3>Currently allocated</h3>
      <Accordion Expandables={CreateAllocationContent(questionnaireAllocationDetails.allocation)} />
      <br />
    </>
  );
}
