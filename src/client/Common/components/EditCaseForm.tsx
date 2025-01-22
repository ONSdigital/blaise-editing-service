import { CaseEditInformation } from 'blaise-api-node-client';
import { ONSButton, ONSPanel, ONSTable } from 'blaise-design-system-react-components';
import { Link, useLocation, useParams } from 'react-router-dom';
import Organisation from 'blaise-api-node-client/lib/cjs/enums/organisation';
import { useState } from 'react';
import { setCaseToUpdate } from '../../api/NodeApi';
import { CaseSummaryParams } from '../types/CaseSummaryParams';
import UserRole from '../enums/UserTypes';

export default function EditCaseForm() {
  const { questionnaireName, caseId } = useParams<keyof CaseSummaryParams>() as CaseSummaryParams;
  const { caseDetails, role }: { caseDetails: CaseEditInformation, role: UserRole } = useLocation().state;
  const [submitting, setSubmitting] = useState(false);
  const [actionState, setActionState] = useState({
    actionPerformed: false,
    actionSuccess: false,
  });

  const updateCase = async () => {
    setSubmitting(true);
    setActionState({ actionPerformed: true, actionSuccess: false });
    await setCaseToUpdate(questionnaireName, caseId);
    // if (responseStatus === 204) {
    //   setActionState({ actionPerformed: true, actionSuccess: true });
    // } else {
    //   setActionState({ actionPerformed: true, actionSuccess: false });
    // }
    setSubmitting(false);
  };

  return (
    <>
      <ONSPanel status="info">
        Please check that the case details are correct before editing the case, once you have made changes to the case you will not be able to undo them.
      </ONSPanel>
      <h1 className="ons-u-mt-s">{questionnaireName}</h1>
      <ONSTable
        columns={[]}
        tableID={`${caseId}-Case-details`}
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
              <Link to={caseDetails.editUrl} target="_blank" rel="noopener noreferrer">Edit interviewer Case</Link>
              )}
              {(role === UserRole.SVT_Supervisor || role === UserRole.FRS_Research) && (
              <Link to={caseDetails.editUrl} target="_blank" rel="noopener noreferrer">Edit Case</Link>
              )}
            </td>
          </tr>
        </>
      </ONSTable>

      {(actionState.actionPerformed && actionState.actionSuccess)
        ? (
          <ONSPanel status="success">
            You have successfully set the case to sync with the editing database overnight
          </ONSPanel>
        ) : null}
      {role === UserRole.Survey_Support && (
        <>
          <br />
          <br />
          <br />
          <ONSPanel status="warn">
            Once Editing is complete set the case to sync with the editing database overnight below.
          </ONSPanel>
          <ONSButton
            label="Set sync with editing overnight"
            primary
            loading={submitting}
            onClick={updateCase}
          />
        </>
      )}
    </>
  );
}
