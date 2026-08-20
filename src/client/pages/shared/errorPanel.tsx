import { Panel } from "blaise-design-system-react-components";
import { useEffect } from "react";

import type { Message } from "../../types/message.types";
import type { Dispatch, ReactElement, SetStateAction } from "react";

interface ErrorPanelProps {
  message: string;
  setMessage?: Dispatch<SetStateAction<Message>>;
}

export default function ErrorPanel({ message, setMessage }: ErrorPanelProps): ReactElement {
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
    <Panel status="error">
      <h4>Something went wrong</h4>
      <p data-testid="ErrorMessage">{message}</p>
    </Panel>
  );
}
