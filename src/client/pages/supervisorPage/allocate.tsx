import { Panel } from "blaise-design-system-react-components";
import { useState } from "react";
import { useParams } from "react-router-dom";

import questionnaireDisplayName from "../../utils/questionnaireFunctions";
import ErrorPanel from "../shared/errorPanel";
import SuccessPanel from "../shared/successPanel";

import AllocateContent from "./sections/allocateContent";

import type { Message } from "../../types/message.types";
import type UserRole from "../../types/user.types";
import type { ReactElement } from "react";

interface AllocateProps {
  supervisorRole: UserRole;
  editorRole: UserRole;
  reallocate: boolean;
}

export type AllocateParams = {
  questionnaireName: string;
};

export default function Allocate({
  supervisorRole,
  editorRole,
  reallocate,
}: AllocateProps): ReactElement {
  const { questionnaireName } = useParams<AllocateParams>();

  if (!questionnaireName) {
    throw new Error("questionnaireName is required");
  }

  const defaultMessage: Message = { show: false, text: "", type: "" };
  const [message, setMessage] = useState(defaultMessage);

  return (
    <>
      <Panel
        status="info"
        id="allocation-page-panel"
      >
        {reallocate === false
          ? "Allocate cases from an interviewer to an editor. All cases conducted by that interviewer will be allocated to the editor"
          : "Reallocate cases from one editor to another editor. All non-completed cases will be transferred"}
      </Panel>

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

      <br />
      <h1>{questionnaireDisplayName(questionnaireName)}</h1>

      <AllocateContent
        questionnaireName={questionnaireName}
        supervisorRole={supervisorRole}
        editorRole={editorRole}
        reallocate={reallocate}
        setMessage={setMessage}
      />
    </>
  );
}
