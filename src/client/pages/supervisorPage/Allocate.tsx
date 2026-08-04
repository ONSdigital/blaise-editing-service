import { ReactElement, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ONSPanel } from 'blaise-design-system-react-components';
import UserRole from '../../types/UserTypes';
import ErrorPanel from '../shared/ErrorPanel';
import SuccessPanel from '../shared/SuccessPanel';
import AllocateContent from './sections/AllocateContent';
import { Message } from '../../types/MessageType';
import questionnaireDisplayName from '../../utils/QuestionnaireFunctions';
import Breadcrumbs from '../shared/Breadcrumbs';

interface AllocateProps {
  supervisorRole: UserRole;
  editorRole: UserRole;
  reallocate: boolean;
}

export type AllocateParams = {
  questionnaireName: string
};

export default function Allocate({ supervisorRole, editorRole, reallocate }: AllocateProps): ReactElement {
  const { questionnaireName } = useParams<keyof AllocateParams>() as AllocateParams;
  const defaultMessage: Message = { show: false, text: '', type: '' };
  const [message, setMessage] = useState(defaultMessage);

  return (
    <>
      <Breadcrumbs BreadcrumbList={
        [
          { link: '/', title: 'Home' },
        ]
      }
      />
      <ONSPanel status="info" testID="allocation-page-panel">
        {
          reallocate === false
            ? 'Allocate cases from an interviewer to an editor. All cases conducted by that interviewer will be allocated to the editor'
            : 'Reallocate cases from one editor to another editor. All non-completed cases will be transfered'
        }
      </ONSPanel>

      {message.show && message.type === 'error' && <ErrorPanel message={message.text} setMessage={setMessage} />}
      {message.show && message.type === 'success' && <SuccessPanel message={message.text} setMessage={setMessage} />}

      <br />
      <h1>{questionnaireDisplayName(questionnaireName)}</h1>

      <AllocateContent questionnaireName={questionnaireName} supervisorRole={supervisorRole} editorRole={editorRole} reallocate={reallocate} setMessage={setMessage} />
    </>
  );
}
