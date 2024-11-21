import { ReactElement } from 'react';
import { CaseEditInformation } from 'blaise-api-node-client';
import { ONSTable } from 'blaise-design-system-react-components';
import { Link } from 'react-router-dom';
import Organisation from 'blaise-api-node-client/lib/cjs/enums/organisation';
import { useAsyncRequestWithThreeParams } from '../../Common/hooks/useAsyncRequest';
import UserRole from '../../Common/enums/UserTypes';
import { getCaseSearchResults } from '../../api/NodeApi';
import AsyncContent from '../../Common/components/AsyncContent';

interface CaseSearchDetailsProps {
  questionnaireName: string;
  caseId: string;
  role: UserRole
}

export default function CaseSearchDetails({ questionnaireName, caseId, role }: CaseSearchDetailsProps): ReactElement {
  const caseSearchResults = useAsyncRequestWithThreeParams<CaseEditInformation[], string, string, UserRole>(getCaseSearchResults, questionnaireName, caseId, role);
  return (
    <div className="case-search-results" data-testid="case-search-results">
      <AsyncContent content={caseSearchResults}>
        {(loadedCaseSearchResults) => (
          <ONSTable
            columns={[
              'Case ID',
              'Outcome',
              'Interviewer',
              'Organisation',
            ]}
            tableID={`${questionnaireName}-Case-results`}
          >
            <>
              {loadedCaseSearchResults.map((caseDetails) => (
                <tr
                  className="ons-table__row"
                  key={caseDetails.primaryKey}
                >
                  <td className="ons-table__cell" aria-label={`${questionnaireName}-CaseID`}>
                    {caseDetails.primaryKey}
                  </td>
                  <td className="ons-table__cell" aria-label={`${questionnaireName}-Outcome`}>
                    {caseDetails.outcome}
                  </td>
                  <td className="ons-table__cell" aria-label={`${questionnaireName}-Interviewer`}>
                    {caseDetails.interviewer}
                  </td>
                  <td className="ons-table__cell" aria-label={`${questionnaireName}-Organisation`}>
                    {Organisation[caseDetails.organisation]}
                  </td>
                  <td className="ons-table__cell links">
                    <Link to={caseDetails.editUrl} target="_blank" rel="noopener noreferrer">Edit case</Link>
                    {' | '}
                    <Link to="/">View case</Link>
                    {' | '}
                    <Link to={`/questionnaires/${questionnaireName}/cases/${caseDetails.primaryKey}/recode`}>Recode case</Link>
                  </td>
                </tr>
              ))}
            </>
          </ONSTable>
        )}
      </AsyncContent>
    </div>
  );
}
