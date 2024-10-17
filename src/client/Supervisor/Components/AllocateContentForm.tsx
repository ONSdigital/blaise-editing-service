import { ONSButton, ONSPanel, ONSSelect } from 'blaise-design-system-react-components';
import { ReactElement, SetStateAction, useState } from 'react';
import Option from '../../Interfaces/controlsInterface';
import { UserAllocationDetails } from '../../../common/interfaces/allocationInterface';

interface AllocateProps {
  allocationDetails: UserAllocationDetails[];
  fromOptions: Option[];
  toOptions: Option[];
  reallocate: boolean;
  allocateCases: (name: string, cases: string[]) => Promise<void>
}

export default function AllocateCases({
  fromOptions, toOptions, allocationDetails, reallocate, allocateCases,
} : AllocateProps): ReactElement {
  const [casesValue, setCasesValue] = useState(['']);
  const [nameValue, setNameValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCasesChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    const user = allocationDetails.find((i) => i.Name === e.target.value);
    setCasesValue(user?.Cases ?? []);
  };

  const handleNameChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setNameValue(e.target?.value);
  };

  if (fromOptions.length === 0 || toOptions.length === 0) {
    return (
      <ONSPanel status="info">
        {
              toOptions.length === 0
                ? 'There are no editors configured'
                : 'There are no cases left to allocate'
            }
      </ONSPanel>
    );
  }

  return (
    <>
      <ONSSelect
        id="select-from"
        label={`${reallocate ? 'Reallocate' : 'Allocate'} cases from ${reallocate ? 'editor' : 'interviewer'}`}
        options={fromOptions}
        value=""
        onChange={handleCasesChange}
        testId="select-from"
      />
      <ONSSelect
        id="select-to"
        label="To editor"
        options={toOptions}
        value=""
        onChange={handleNameChange}
        testId="select-to"
      />
      <br />
      <ONSButton
        label={`${reallocate ? 'Reallocate' : 'Allocate'}`}
        primary
        loading={submitting}
        onClick={async () => { setSubmitting(true); await allocateCases(nameValue, casesValue); setSubmitting(false); }}
      />
    </>
  );
}
