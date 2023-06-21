import { CaseStatus } from "blaise-api-node-client";
import React from "react"
import { useParams } from "react-router-dom";
import { getCaseStatuses } from "../api/questionnaires";
import AsyncContent from "../components/AsyncContent";
import CasesList from "../components/CasesList";
import { useAsyncRequest } from "../hooks/useAsyncRequest";

interface Params {
    questionnaireName : string
}

export default function Cases() {
    const {questionnaireName} = useParams();
    const cases = useAsyncRequest<CaseStatus[]>(getCaseStatuses('LMS'));
    
    return (
        <AsyncContent content={cases}>
          {(loadedCases) => <CasesList cases={loadedCases} />}
        </AsyncContent>
      );
}  