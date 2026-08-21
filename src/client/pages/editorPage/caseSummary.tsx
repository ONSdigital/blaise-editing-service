import { type ReactElement } from "react";
import { useParams } from "react-router-dom";

import { getCaseSummary } from "../../api/nodeApi";
import { type CaseSummaryParams } from "../../types/caseSummaryParams.types";
import { useAsyncRequest } from "../../utils/useAsyncRequest";
import AsyncContent from "../shared/asyncContent";

import CaseSummaryContent from "./sections/caseSummaryContent";

export default function CaseSummary(): ReactElement {
  const { questionnaireName, caseId } = useParams<CaseSummaryParams>();

  if (!questionnaireName || !caseId) {
    throw new Error("questionnaireName and caseId are required");
  }

  const caseSummary = useAsyncRequest(getCaseSummary, questionnaireName, caseId);

  return (
    <div
      data-testid="Summary"
      className="ons-u-mb-l"
    >
      <AsyncContent content={caseSummary}>
        {(caseSummaryContent) => <CaseSummaryContent caseSummary={caseSummaryContent} />}
      </AsyncContent>
    </div>
  );
}
