import { CaseEditInformation } from 'blaise-api-node-client';
import { ONSButton, ONSPanel, ONSTable } from 'blaise-design-system-react-components';
import { Link } from 'react-router-dom';
import Organisation from 'blaise-api-node-client/lib/cjs/enums/organisation';
import { ReactElement, useCallback, useState } from 'react';
import { setCaseToUpdate } from '../../api/NodeApi';
import UserRole from '../enums/UserTypes';
import questionnaireDisplayName from '../functions/QuestionnaireFunctions';
import { Message } from '../types/MessageType';

interface EditCaseFormProps {
  caseDetails: CaseEditInformation;
  questionnaireName: string;
  caseId: string;
  role: UserRole;
  setMessage: React.Dispatch<React.SetStateAction<Message>>;
}

export default function EditCaseForm({
  caseDetails, questionnaireName, caseId, role, setMessage,
}: EditCaseFormProps): ReactElement {
  const [submitting, setSubmitting] = useState(false);

  const updateCase = useCallback(async () => {
    setSubmitting(true);
    setMessage({ show: false, text: '', type: '' });
    try {
      const response = await setCaseToUpdate(questionnaireName, caseId);
      if (response !== 204) {
        throw new Error(`Failed to set case to update, setCaseToUpdate got response code: ${response}`);
      }
      setMessage({ show: true, text: `Successfully set case with ID, ${caseDetails.primaryKey}, to update editing database overnight`, type: 'success' });
    } catch (error: unknown) {
      setMessage({ show: true, text: `Failed to set case with ID, ${caseDetails.primaryKey}, to update, please try again in a few seconds or contact service desk to raise a support ticket`, type: 'error' });
    }
    setSubmitting(false);
  }, [setMessage, questionnaireName, caseId, caseDetails.primaryKey]);

  return (
    <>
      <ONSPanel status="info" testID="edit-case-form-panel">
        Please check that the case details are correct before editing the case, once you have made changes to the case you will not be able to undo them.
      </ONSPanel>
      <br />
      <h1 className="ons-u-mt-s">{questionnaireDisplayName(questionnaireName)}</h1>
      <div className="ons-u-mb-l">
        <ONSTable
          columns={[]}
          tableID={`${caseDetails.primaryKey}-case-details`}
        >
          <>
            <tr
              className="ons-table__row"
              key={`${caseDetails.primaryKey}-CaseID`}
            >
              <td className="ons-table__cell ons-u-fs-r--b">Case ID:</td>
              <td className="ons-table__cell">{caseDetails.primaryKey}</td>
            </tr>
            <tr
              className="ons-table__row"
              key={`${caseDetails.primaryKey}-Outcome`}
            >
              <td className="ons-table__cell ons-u-fs-r--b">Outcome:</td>
              <td className="ons-table__cell">{caseDetails.outcome}</td>
            </tr>
            <tr
              className="ons-table__row"
              key={`${caseDetails.primaryKey}-Interviewer`}
            >
              <td className="ons-table__cell ons-u-fs-r--b">Interviewer:</td>
              <td className="ons-table__cell">{caseDetails.interviewer}</td>
            </tr>
            <tr
              className="ons-table__row"
              key={`${caseDetails.primaryKey}-Organisation`}
            >
              <td className="ons-table__cell ons-u-fs-r--b">Organisation:</td>
              <td className="ons-table__cell">{Organisation[caseDetails.organisation]}</td>
            </tr>
            <tr
              className="ons-table__row"
              key={`${caseDetails.primaryKey}-Editing-link`}
            >
              <td className="ons-table__cell ons-u-fs-r--b">Editing link:</td>
              <td className="ons-table__cell ons-u-fs-r--b">
                {role === UserRole.Survey_Support && (
                <Link data-testid="edit-case-link" to={caseDetails.editUrl} target="_blank" rel="noopener noreferrer">Edit interviewer Case</Link>
                )}
                {(role === UserRole.SVT_Supervisor || role === UserRole.FRS_Research) && (
                <Link data-testid="edit-case-link" to={caseDetails.editUrl} target="_blank" rel="noopener noreferrer">Edit Case</Link>
                )}
              </td>
            </tr>
          </>
        </ONSTable>
      </div>
      {role === UserRole.Survey_Support && (
      <>
        <br />
        <ONSPanel status="warn">
          After finalising edits, sync your changes overnight with the editing database by clicking the button below.
        </ONSPanel>
        <div className="ons-u-mb-l">
          <ONSButton
            label="Update case"
            id="update-case-button"
            primary
            loading={submitting}
            disabled={submitting}
            onClick={updateCase}
          />
        </div>
      </>
      )}
    </>
  );
}
