import {
  Accordion, ONSButton, ONSPanel, ONSSelect, ONSTextInput,
} from 'blaise-design-system-react-components';
import { ExpandableContent } from 'blaise-design-system-react-components/build/src/components/Accordion';
import { ReactElement } from 'react';
import { User } from 'blaise-api-node-client';
import { OldAllocationDetails } from '../../common/interfaces/questionnaireAllocationInterface';
import { questionnaireAllocationMockObject } from '../../test/mockObjects/questionnaireAllocationMockObject';
import EditorAllocation from './EditorAllocation';
import { caseEditorsMockObject } from '../../test/mockObjects/userMockObject';
import { AllocationDetails } from '../../common/interfaces/surveyInterface';

function CreateAllocationContent(allocation: OldAllocationDetails[]):ExpandableContent[] {
  return allocation.map(({ editor, cases }) => ({ title: editor, content: <EditorAllocation cases={cases} /> }));
}

function mapEditorsToOptionList(editors:User[]) {
  return editors.map((editor) => ({
    label: editor.name,
    value: editor.name,
  }));
}

interface QuestionnaireAllocationProps {
  questionnaireName: string;
  allocationDetails: AllocationDetails
}

export default function QuestionnaireAllocation({ questionnaireName, allocationDetails }: QuestionnaireAllocationProps): ReactElement {
  const questionnaireAllocationDetails = questionnaireAllocationMockObject;

  return (
    <>
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
      <Accordion Expandables={CreateAllocationContent(questionnaireAllocationDetails.allocation)} />
      <br />

      <ONSSelect
        value="Select the editor"
        id="select-editor"
        label="Select editor"
        options={mapEditorsToOptionList(caseEditorsMockObject)}
      />

      <ONSTextInput
        id="select-number"
        label="Select number of cases to allocate"
        placeholder="50"
      />

      <ONSButton
        label="Allocate"
        primary
      />
    </>
  );
}
