import { ONSPanel } from 'blaise-design-system-react-components';
import { Dispatch, ReactElement, SetStateAction } from 'react';
import { Message } from '../types/MessageType';

interface ErrorPanelProps {
  message: string;
  setMessage?: Dispatch<SetStateAction<Message>>;
}

export default function ErrorPanel({ message, setMessage }: ErrorPanelProps) : ReactElement {
  setTimeout(() => (setMessage ? setMessage({ show: false, text: '', type: '' }) : () => {}), 5000);

  return (
    <ONSPanel status="error">
      <h4>Something went wrong</h4>
      <p data-testid="ErrorMessage">
        {message}
      </p>
    </ONSPanel>
  );
}
