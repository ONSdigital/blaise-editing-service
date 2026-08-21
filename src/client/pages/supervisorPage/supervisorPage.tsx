import { getSurveys } from "../../api/nodeApi";
import { useAsyncRequest } from "../../utils/useAsyncRequest";
import AsyncContent from "../shared/asyncContent";
import ErrorPanel from "../shared/errorPanel";
import SurveysList from "../shared/surveysList";

import type { User } from "blaise-api-node-client";

interface SurveyProps {
  user: User;
}

export default function SupervisorPage({ user }: SurveyProps) {
  const surveys = useAsyncRequest(getSurveys, String(user.role));
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error") ?? "";

  return (
    <div data-testid="Surveys">
      {error != null && error.length > 0 && <ErrorPanel message={error} />}
      <AsyncContent content={surveys}>
        {(loadedSurveys) => (
          <SurveysList
            surveys={loadedSurveys}
            user={user}
          />
        )}
      </AsyncContent>
    </div>
  );
}
