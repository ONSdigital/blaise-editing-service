import { Button, Panel, Table } from "blaise-design-system-react-components";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

import { setCaseToUpdate } from "../../api/nodeApi";
import UserRole from "../../types/user.types";
import questionnaireDisplayName from "../../utils/questionnaireFunctions";

import type { Message } from "../../types/message.types";
import type { CaseEditInformation } from "blaise-api-node-client";
import type { ReactElement } from "react";

interface EditCaseFormProps {
  caseDetails: CaseEditInformation;
  questionnaireName: string;
  caseId: string;
  role: UserRole;
  setMessage: React.Dispatch<React.SetStateAction<Message>>;
}

export default function EditCaseForm({
  caseDetails,
  questionnaireName,
  caseId,
  role,
  setMessage,
}: EditCaseFormProps): ReactElement {
  const [submitting, setSubmitting] = useState(false);

  const updateCase = useCallback(async () => {
    setSubmitting(true);
    setMessage({ show: false, text: "", type: "" });
    try {
      const response = await setCaseToUpdate(questionnaireName, caseId);

      if (response !== 204) {
        throw new Error(
          `Failed to set case to update, setCaseToUpdate got response code: ${response}`,
        );
      }

      setMessage({
        show: true,
        text: `Successfully set case with ID, ${caseDetails.primaryKey}, to update editing database overnight`,
        type: "success",
      });
    } catch {
      setMessage({
        show: true,
        text: `Failed to set case with ID, ${caseDetails.primaryKey}, to update, please try again in a few seconds or contact service desk to raise a support ticket`,
        type: "error",
      });
    }

    setSubmitting(false);
  }, [setMessage, questionnaireName, caseId, caseDetails.primaryKey]);

  return (
    <>
      <Panel
        status="info"
        id="edit-case-form-panel"
      >
        Please check that the case details are correct before editing the case, once you have made
        changes to the case you will not be able to undo them.
      </Panel>
      <br />
      <h1 className="ons-u-mt-s">{questionnaireDisplayName(questionnaireName)}</h1>
      <div className="ons-u-mb-l">
        <Table
          columns={[]}
          id={`${caseDetails.primaryKey}-case-details`}
        >
          <>
            <tr
              className="ons-table__row"
              key={`${caseDetails.primaryKey}-CaseID`}
            >
              <td className="ons-table__cell ons-col-6@m">Case ID</td>
              <td className="ons-table__cell ons-col-6@m ons-u-fs-r--b">
                {caseDetails.primaryKey}
              </td>
            </tr>
            <tr
              className="ons-table__row"
              key={`${caseDetails.primaryKey}-Outcome`}
            >
              <td className="ons-table__cell ons-col-6@m">Outcome</td>
              <td className="ons-table__cell ons-col-6@m ons-u-fs-r--b">{caseDetails.outcome}</td>
            </tr>
            <tr
              className="ons-table__row"
              key={`${caseDetails.primaryKey}-Interviewer`}
            >
              <td className="ons-table__cell ons-col-6@m">Interviewer</td>
              <td className="ons-table__cell ons-col-6@m ons-u-fs-r--b">
                {caseDetails.interviewer}
              </td>
            </tr>
            <tr
              className="ons-table__row"
              key={`${caseDetails.primaryKey}-Organisation`}
            >
              <td className="ons-table__cell ons-col-6@m">Organisation</td>
              <td className="ons-table__cell ons-col-6@m ons-u-fs-r--b">
                {caseDetails.organisation}
              </td>
            </tr>
            <tr
              className="ons-table__row"
              key={`${caseDetails.primaryKey}-Editing-link`}
            >
              <td className="ons-table__cell ons-col-6@m">Editing link</td>
              <td className="ons-table__cell ons-col-6@m ons-u-fs-r--b">
                {role === UserRole.Survey_Support && (
                  <Link
                    data-testid="edit-case-link"
                    to={caseDetails.editUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Edit interviewer Case
                  </Link>
                )}
                {(role === UserRole.SVT_Supervisor || role === UserRole.FRS_Researcher) && (
                  <Link
                    data-testid="edit-case-link"
                    to={caseDetails.editUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Edit Case
                  </Link>
                )}
              </td>
            </tr>
          </>
        </Table>
      </div>
      {role === UserRole.Survey_Support && (
        <>
          <br />
          <Panel status="warn">
            After finalising edits, sync your changes overnight with the editing database by
            clicking the button below.
          </Panel>
          <div className="ons-u-mb-l">
            <Button
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
