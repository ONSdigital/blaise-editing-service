import { ReactElement } from 'react';
import { CaseEditInformation } from 'blaise-api-node-client';
import { Link } from 'react-router-dom';
import UserRole from '../enums/UserTypes';

interface CaseSearchDetailsProps {
  questionnaireName: string
  caseDetails: CaseEditInformation;
  role: UserRole;
}

export default function CaseSearchLinks({ questionnaireName, caseDetails, role }: CaseSearchDetailsProps): ReactElement {
  return (
    <>
      {(role === UserRole.SVT_Supervisor || role === UserRole.FRS_Research)
                      && (
                        <>
                          <Link to={caseDetails.editUrl} target="_blank" rel="noopener noreferrer">Edit case</Link>
                          {' | '}
                          <Link to={caseDetails.readOnlyUrl} target="_blank" rel="noopener noreferrer">View case</Link>
                        </>
                      )}

      {role === UserRole.Survey_Support
                      && (
                        <>
                          <Link to={caseDetails.editUrl} target="_blank" rel="noopener noreferrer">Edit interviewer case</Link>
                          {' | '}
                          <Link to={caseDetails.readOnlyUrl} target="_blank" rel="noopener noreferrer">View interviewer case</Link>
                          {' | '}
                          <Link to={`/questionnaires/${questionnaireName}/cases/${caseDetails.primaryKey}/recode`}>Recode interviewer case</Link>
                        </>
                      )}
    </>
  );
}
