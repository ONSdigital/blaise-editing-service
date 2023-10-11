import {
  ONSButton, ONSPanel, ONSSelect, ONSTextInput,
} from 'blaise-design-system-react-components';
import { ReactElement } from 'react';
import { User } from 'blaise-api-node-client';
import { Link } from 'react-router-dom';
import { caseEditorsMockObject } from '../../test/mockObjects/userMockObject';
import { AllocationDetails } from '../../common/interfaces/surveyInterface';

function mapEditorsToOptionList(editors:User[]) {
  return editors.map((editor) => ({
    label: editor.name,
    value: editor.name,
  }));
}

interface AllocateCasesProps {
  questionnaireName: string;
  allocationDetails: AllocationDetails;
  userName? :string;
}

export default function AllocateCases({ questionnaireName, allocationDetails, userName }: AllocateCasesProps): ReactElement {
  console.debug(allocationDetails);

  return (

    <>
      <Link to={`/questionnaires/${questionnaireName}/allocation/allocated`} style={{ fontWeight: 'normal' }}>
        Currently allocated to
        {' '}
        {questionnaireName}
      </Link>

      <ONSPanel spacious status="info" testID="info-panel">
        Allocate cases for
        {' '}
        {questionnaireName}
      </ONSPanel>

      <ONSSelect
        value="Select the editor"
        id="select-editor"
        label="Select editor"
        options={mapEditorsToOptionList(caseEditorsMockObject)}
        defaultValue={userName ?? 'Select the editor'}

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
