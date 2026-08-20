import { useState } from "react";
import { useParams } from "react-router-dom";

import { getSpecificCaseEditInformation } from "../../api/nodeApi";
import { type CaseSummaryParams } from "../../types/caseSummaryParams.types";
import { type Message } from "../../types/message.types";
import { useAsyncRequest } from "../../utils/useAsyncRequest";

import AsyncContent from "./asyncContent";
import EditCaseForm from "./editCaseForm";
import ErrorPanel from "./errorPanel";
import SuccessPanel from "./successPanel";

import type UserRole from "../../types/user.types";

export default function EditCaseContent({ role }: { role: UserRole }) {
  const defaultMessage: Message = { show: false, text: "", type: "" };
  const [message, setMessage] = useState(defaultMessage);

  const { questionnaireName, caseId } = useParams<CaseSummaryParams>();

  if (!questionnaireName || !caseId) {
    throw new Error("questionnaireName and caseId are required");
  }

  const caseDetails = useAsyncRequest(
    getSpecificCaseEditInformation,
    questionnaireName,
    caseId,
    role,
  );

  return (
    <AsyncContent content={caseDetails}>
      {(loadedCaseDetails) => (
        <>
          {message.show && message.type === "error" && (
            <ErrorPanel
              message={message.text}
              setMessage={setMessage}
            />
          )}
          {message.show && message.type === "success" && (
            <SuccessPanel
              message={message.text}
              setMessage={setMessage}
            />
          )}
          <EditCaseForm
            caseDetails={loadedCaseDetails}
            questionnaireName={questionnaireName}
            caseId={caseId}
            role={role}
            setMessage={setMessage}
          />
        </>
      )}
    </AsyncContent>
  );
}
