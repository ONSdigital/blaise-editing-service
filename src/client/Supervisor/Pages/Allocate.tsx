import { ReactElement, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ONSPanel } from 'blaise-design-system-react-components';
import UserRole from '../../Common/enums/UserTypes';
import ErrorPanel from '../../Common/components/ErrorPanel';
import SuccessPanel from '../../Common/components/SuccessPanel';
import AllocateContent from '../Components/AllocateContent';
import { Message } from '../../Common/types/MessageType';
import questionnaireDisplayName from '../../Common/functions/QuestionnaireFunctions';

interface AllocateProps {
  supervisorRole: UserRole;
  editorRole: UserRole;
  reallocate: boolean;
}

export type AllocateParams = {
  questionnaireName: string
};

export default function Allocate({ supervisorRole, editorRole, reallocate } : AllocateProps): ReactElement {
  const { questionnaireName } = useParams<keyof AllocateParams>() as AllocateParams;
  const defaultMessage: Message = { show: false, text: '', type: '' };
  const [message, setMessage] = useState(defaultMessage);

  return (
    <>
      <ONSPanel status="info" testID="allocation-page-panel">
        {
          reallocate === false
            ? 'Allocate cases from an interviewer to an editor. All cases conducted by that interviewer will be allocated to the editor'
            : 'Reallocate cases from one editor to another editor. All non-completed cases will be transfered'
        }
      </ONSPanel>

      {message.show && message.type === 'error' && <ErrorPanel message={message.text} setMessage={setMessage} /> }
      {message.show && message.type === 'success' && <SuccessPanel message={message.text} setMessage={setMessage} /> }

      <br />
      <h3>{questionnaireDisplayName(questionnaireName)}</h3>

      <AllocateContent questionnaireName={questionnaireName} supervisorRole={supervisorRole} editorRole={editorRole} reallocate={reallocate} setMessage={setMessage} />
    </>
  );
}
