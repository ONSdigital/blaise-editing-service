import { Button, TextInput } from "blaise-design-system-react-components";
import { type ChangeEvent, type ReactElement, useState } from "react";

import CaseSearchDetails from "./caseSearchDetails";

import type UserRole from "../../types/user.types";

interface CaseSearchFormProps {
  questionnaireName: string;
  userRole: UserRole;
}

export default function CaseSearchForm({
  questionnaireName,
  userRole,
}: CaseSearchFormProps): ReactElement {
  const [caseIdValue, setCaseIdValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCaseIdChange = (e: ChangeEvent<HTMLInputElement>, value: string) => {
    setCaseIdValue(value || e.target.value);
  };

  return (
    <>
      <div className="ons-u-mt-l">
        <TextInput
          label="Enter case ID"
          id="caseid"
          autoFocus
          onChange={handleCaseIdChange}
          value={caseIdValue}
        />
      </div>
      <div className="ons-u-mt-s">
        <Button
          label="Search"
          primary
          loading={submitting}
          disabled={caseIdValue.trim().length === 0}
          onClick={async () => {
            setSubmitting(true);
            setSearchValue(caseIdValue);
            setSubmitting(false);
          }}
        />
      </div>

      {searchValue.length > 0 && (
        <div className="ons-u-mb-l">
          <CaseSearchDetails
            questionnaireName={questionnaireName}
            caseId={searchValue}
            role={userRole}
          />
        </div>
      )}
    </>
  );
}
