import { Button, Panel, Select } from "blaise-design-system-react-components";
import { useState } from "react";

import type { UserAllocationDetails } from "../../../../common/types/allocation.types";
import type Option from "../../../types/controls.types";
import type { ReactElement, SetStateAction } from "react";

interface AllocateProps {
  allocationDetails: UserAllocationDetails[];
  fromOptions: Option[];
  toOptions: Option[];
  reallocate: boolean;
  allocateCases: (name: string, cases: string[]) => Promise<void>;
}

export default function AllocateContentForm({
  fromOptions,
  toOptions,
  allocationDetails,
  reallocate,
  allocateCases,
}: AllocateProps): ReactElement {
  const [fromValue, setFromValue] = useState("");
  const [casesValue, setCasesValue] = useState([""]);
  const [toEditorName, setToEditorName] = useState("");
  const [numberOfCases, setNumberOfCases] = useState("-1");
  const [submitting, setSubmitting] = useState(false);

  async function handleAllocateCases() {
    const maxCasesToAllocate = +numberOfCases;

    if (maxCasesToAllocate === -1 || casesValue.length <= maxCasesToAllocate) {
      await allocateCases(toEditorName, casesValue);

      return;
    }

    await allocateCases(toEditorName, casesValue.slice(0, maxCasesToAllocate));
  }

  const handleCasesChange = (e: { target: { value: SetStateAction<string> } }) => {
    setFromValue(e.target.value);
    const user = allocationDetails.find((editor) => editor.Name === e.target.value);

    setCasesValue(user?.Cases ?? []);
  };

  const handleNameChange = (e: { target: { value: SetStateAction<string> } }) => {
    setToEditorName(e.target?.value);
  };

  const handleNumberOfCasesChange = (e: { target: { value: SetStateAction<string> } }) => {
    setNumberOfCases(e.target?.value);
  };

  if (fromOptions.length === 0 || toOptions.length === 0) {
    return (
      <Panel status="info">
        {toOptions.length === 0
          ? "There are no editors configured"
          : "There are no cases left to allocate"}
      </Panel>
    );
  }

  return (
    <>
      <Select
        id="select-from"
        label={`${reallocate ? "Reallocate" : "Allocate"} cases from ${reallocate ? "editor" : "interviewer"}`}
        options={fromOptions}
        value={fromValue}
        onChange={handleCasesChange}
      />
      <Select
        id="select-to"
        label="To editor"
        options={toOptions}
        value={toEditorName}
        onChange={handleNameChange}
      />
      <Select
        id="number-of-cases"
        label="Number of cases"
        options={[
          {
            label: "All",
            value: "-1",
          },
          {
            label: "50",
            value: "50",
          },
          {
            label: "45",
            value: "45",
          },
          {
            label: "40",
            value: "40",
          },
          {
            label: "35",
            value: "35",
          },
          {
            label: "30",
            value: "30",
          },
          {
            label: "25",
            value: "25",
          },
          {
            label: "20",
            value: "20",
          },
          {
            label: "15",
            value: "15",
          },
          {
            label: "10",
            value: "10",
          },
          {
            label: "5",
            value: "5",
          },
          {
            label: "1",
            value: "1",
          },
        ]}
        value={numberOfCases}
        onChange={handleNumberOfCasesChange}
      />
      <br />
      <Button
        label={`${reallocate ? "Reallocate" : "Allocate"}`}
        primary
        loading={submitting}
        onClick={async () => {
          setSubmitting(true);
          await handleAllocateCases();
          setSubmitting(false);
        }}
      />
    </>
  );
}
