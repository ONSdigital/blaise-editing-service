import { Panel, Table } from "blaise-design-system-react-components";

import { getCaseSearchResults } from "../../api/nodeApi";
import { useAsyncRequest } from "../../utils/useAsyncRequest";

import AsyncContent from "./asyncContent";
import CaseSearchLinks from "./caseSearchLinks";

import type UserRole from "../../types/user.types";
import type { ReactElement } from "react";

interface CaseSearchDetailsProps {
  questionnaireName: string;
  caseId: string;
  role: UserRole;
}

export default function CaseSearchDetails({
  questionnaireName,
  caseId,
  role,
}: CaseSearchDetailsProps): ReactElement {
  const caseSearchResults = useAsyncRequest(getCaseSearchResults, questionnaireName, caseId, role);

  return (
    <div
      className="case-search-results"
      data-testid="case-search-results"
    >
      <AsyncContent content={caseSearchResults}>
        {(loadedCaseSearchResults) =>
          loadedCaseSearchResults.length > 0 ? (
            <Table
              columns={["Case ID", "Outcome", "Interviewer", "Organisation"]}
              id={`${questionnaireName}-Case-results`}
            >
              <>
                {loadedCaseSearchResults.map((caseDetails) => (
                  <tr
                    className="ons-table__row"
                    key={caseDetails.primaryKey}
                  >
                    <td
                      className="ons-table__cell"
                      aria-label={`${questionnaireName}-CaseID`}
                    >
                      {caseDetails.primaryKey}
                    </td>
                    <td
                      className="ons-table__cell"
                      aria-label={`${questionnaireName}-Outcome`}
                    >
                      {caseDetails.outcome}
                    </td>
                    <td
                      className="ons-table__cell"
                      aria-label={`${questionnaireName}-Interviewer`}
                    >
                      {caseDetails.interviewer}
                    </td>
                    <td
                      className="ons-table__cell"
                      aria-label={`${questionnaireName}-Organisation`}
                    >
                      {caseDetails.organisation}
                    </td>
                    <td
                      className="ons-table__cell ons-u-ta-right"
                      aria-label={`${questionnaireName}-Links`}
                    >
                      <CaseSearchLinks
                        questionnaireName={questionnaireName}
                        caseDetails={caseDetails}
                        role={role}
                      />
                    </td>
                  </tr>
                ))}
              </>
            </Table>
          ) : (
            <Panel status="info">
              <p>No results found for this case ID.</p>
            </Panel>
          )
        }
      </AsyncContent>
    </div>
  );
}
