import { ExternalLink } from "blaise-design-system-react-components";
import { type ReactElement } from "react";
import { Link } from "react-router-dom";

import UserRole from "../../types/user.types";

import type { CaseEditInformation } from "blaise-api-node-client";

interface CaseSearchDetailsProps {
  caseDetails: CaseEditInformation;
  role: UserRole;
  questionnaireName: string;
}

export default function CaseSearchLinks({
  questionnaireName,
  caseDetails,
  role,
}: CaseSearchDetailsProps): ReactElement {
  return (
    <>
      {(role === UserRole.SVT_Supervisor || role === UserRole.FRS_Researcher) && (
        <>
          <Link
            to={`/questionnaires/${questionnaireName}/cases/${caseDetails.primaryKey}/editcase`}
          >
            Edit case
          </Link>
          {" | "}
          <ExternalLink
            text="View case"
            link={caseDetails.readOnlyUrl}
          />
        </>
      )}

      {role === UserRole.Survey_Support && (
        <>
          <Link
            to={`/questionnaires/${questionnaireName}/cases/${caseDetails.primaryKey}/editcase`}
          >
            Edit interviewer case
          </Link>
          {" | "}
          <ExternalLink
            text="View interviewer case"
            link={caseDetails.readOnlyUrl}
          />
        </>
      )}
    </>
  );
}
