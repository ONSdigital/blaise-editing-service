import { CaseEditInformation } from 'blaise-api-node-client';
import { ONSButton, ONSPanel } from 'blaise-design-system-react-components';
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
  console.log(role);

  return (
    <>
      <ONSPanel status="warn">
        Please confirm that the case details are correct before editing the case, once you have made changes to the case you will not be able to undo them.
      </ONSPanel>
      <div className="questionnaire">
        <ONSPanel status="info">
          <dl
            className="ons-metadata ons-metadata__list ons-grid ons-grid--gutterless ons-u-cf ons-u-mb-no"
            title="Questionnares"
            data-testid={`${questionnaireName}-Search-Content`}
            style={{ padding: '0 0 15px 5px' }}
          >
            <dt className="ons-description-list__term ons-grid__col ons-col-5@m">Case ID:</dt>
            <dd className="ons-description-list__value ons-grid__col ons-col-7@m">{caseDetails.primaryKey}</dd>
            <dt className="ons-description-list__term ons-grid__col ons-col-5@m">Outcome:</dt>
            <dd className="ons-description-list__value ons-grid__col ons-col-7@m">{caseDetails.outcome}</dd>
            <dt className="ons-description-list__term ons-grid__col ons-col-5@m">Interviewer:</dt>
            <dd className="ons-description-list__value ons-grid__col ons-col-7@m">{caseDetails.interviewer}</dd>
            <dt className="ons-description-list__term ons-grid__col ons-col-5@m">Organisation:</dt>
            <dd className="ons-description-list__value ons-grid__col ons-col-7@m">{Organisation[caseDetails.organisation]}</dd>
          </dl>
        </ONSPanel>
        <br />
        {role === UserRole.Survey_Support && (
        <Link to={caseDetails.editUrl} target="_blank" rel="noopener noreferrer">Edit interviewer Case</Link>
        )}
        {(role === UserRole.SVT_Supervisor || role === UserRole.FRS_Research) && (
        <Link to={caseDetails.editUrl} target="_blank" rel="noopener noreferrer">Edit Case</Link>
        )}

      </div>
      {role === UserRole.Survey_Support && (
        <>
          <br />
          <br />
          <br />
          <ONSPanel status="warn">
            Once Editing is comeplete set the case to sync with editing database overnight below.
          </ONSPanel>
          <ONSButton
            label="Set sync with editing overnight"
            primary
            loading={submitting}
            onClick={async () => { setSubmitting(true); await setCaseToUpdate(questionnaireName, caseId); setSubmitting(false); }}
          />
        </>
      )}
    </>
  );
}
