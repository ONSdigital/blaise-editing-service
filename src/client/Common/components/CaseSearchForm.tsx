import { ReactElement, SetStateAction, useState } from 'react';
import { ONSButton, ONSTextInput } from 'blaise-design-system-react-components';
import UserRole from '../enums/UserTypes';
import CaseSearchDetails from './CaseSearchDetails';

interface CaseSearchFormProps {
  questionnaireName: string;
  userRole: UserRole;
}

export default function CaseSearchForm({ questionnaireName, userRole }: CaseSearchFormProps): ReactElement {
  const [caseIdValue, setCaseIdValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCaseIdChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setCaseIdValue(e.target?.value);
  };

  return (
    <>
      <ONSTextInput
        label="Enter case ID"
        id="caseid"
        autoFocus
        onChange={handleCaseIdChange}
      />
      <ONSButton
        label="Search"
        primary
        loading={submitting}
        disabled={caseIdValue.trim().length === 0}
        onClick={async () => { setSubmitting(true); setSearchValue(caseIdValue); setSubmitting(false); }}
      />
      <br />
      <br />

      {searchValue.length > 0 && <CaseSearchDetails questionnaireName={questionnaireName} caseId={searchValue} role={userRole} />}
    </>
  );
}
