import { Panel } from "blaise-design-system-react-components";
import { useEffect } from "react";

import type { Message } from "../../types/message.types";
import type { Dispatch, ReactElement, SetStateAction } from "react";

interface SuccessPanelProps {
  message: string;
  setMessage?: Dispatch<SetStateAction<Message>>;
}

export default function SuccessPanel({ message, setMessage }: SuccessPanelProps): ReactElement {
  useEffect(() => {
    if (!setMessage) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      setMessage({ show: false, text: "", type: "" });
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [setMessage]);

  return (
    <Panel status="success">
      <h4>Success</h4>
      <p data-testid="SuccessMessage">{message}</p>
    </Panel>
  );
}
