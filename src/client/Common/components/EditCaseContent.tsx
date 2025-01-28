import { CaseEditInformation } from 'blaise-api-node-client';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { getSpecificCaseEditInformation } from '../../api/NodeApi';
import { CaseSummaryParams } from '../types/CaseSummaryParams';
import UserRole from '../enums/UserTypes';
import AsyncContent from './AsyncContent';
import { useAsyncRequestWithThreeParams } from '../hooks/useAsyncRequest';
import { Message } from '../types/MessageType';
import ErrorPanel from './ErrorPanel';
import SuccessPanel from './SuccessPanel';
import EditCaseForm from './EditCaseForm';

export default function EditCaseContent({ role }: { role: UserRole }) {
  const defaultMessage: Message = { show: false, text: '', type: '' };
  const [message, setMessage] = useState(defaultMessage);
  const { questionnaireName, caseId } = useParams<keyof CaseSummaryParams>() as CaseSummaryParams;
  const caseDetails = useAsyncRequestWithThreeParams<CaseEditInformation, string, string, UserRole>(getSpecificCaseEditInformation, questionnaireName, caseId, role);

  return (
    <AsyncContent content={caseDetails}>
      {(loadedCaseDetails) => (
        <>
          {message.show && message.type === 'error' && <ErrorPanel message={message.text} setMessage={setMessage} /> }
          {message.show && message.type === 'success' && <SuccessPanel message={message.text} setMessage={setMessage} /> }
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
