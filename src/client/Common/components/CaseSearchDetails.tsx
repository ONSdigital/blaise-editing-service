import { ReactElement } from 'react';
import { CaseEditInformation } from 'blaise-api-node-client';
import { ONSPanel, ONSTable } from 'blaise-design-system-react-components';
import Organisation from 'blaise-api-node-client/lib/cjs/enums/organisation';
import { useAsyncRequestWithThreeParams } from '../hooks/useAsyncRequest';
import UserRole from '../enums/UserTypes';
import { getCaseSearchResults } from '../../api/NodeApi';
import AsyncContent from './AsyncContent';
import CaseSearchLinks from './CaseSearchLinks';

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
          loadedCaseSearchResults.length > 0 ? (
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
                    <td className="ons-table__cell links" aria-label={`${questionnaireName}-Links`}>
                      <CaseSearchLinks questionnaireName={questionnaireName} caseDetails={caseDetails} role={role} />
                    </td>
                  </tr>
                ))}
              </>
            </ONSTable>
          ) : (
            <ONSPanel status="info">
              <p>No results found for this case ID.</p>
            </ONSPanel>
          )
        )}
      </AsyncContent>
    </div>
  );
}
