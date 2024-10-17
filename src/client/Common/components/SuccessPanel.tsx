import { ONSPanel } from 'blaise-design-system-react-components';
import { Dispatch, ReactElement, SetStateAction } from 'react';
import { Message } from '../types/MessageType';

interface SuccessPanelProps {
  message: string;
  setMessage?: Dispatch<SetStateAction<Message>>;
}

export default function SuccessPanel({ message, setMessage }: SuccessPanelProps) : ReactElement {
  setTimeout(() => (setMessage ? setMessage({ show: false, text: '', type: '' }) : () => {}), 5000);

  return (
    <ONSPanel status="success">
      <h4>Success</h4>
      <p data-testid="SuccessMessage">
        {message}
      </p>
    </ONSPanel>
  );
}
