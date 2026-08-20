import { Button, Panel, Select, Table } from "blaise-design-system-react-components";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

import { DownloadCaseSummaryLink } from "../../shared/downloadCaseSummaryLink";

import type { QuestionnaireDetails } from "../../../../common/types/survey.types";
import type { EditorInformation } from "../../../types/editor.types";
import type { ReactElement } from "react";

interface EditorContentProps {
  editorInformation: EditorInformation;
  questionnaire: QuestionnaireDetails;
}

export default function EditorContent({
  editorInformation,
  questionnaire,
}: EditorContentProps): ReactElement {
  const [status, setStatus] = useState("");
  const [errorPanelMessage, setErrorPanelMessage] = useState<string | null>(null);

  const handleDownloadError = useCallback((message: string) => {
    setErrorPanelMessage(message);
  }, []);

  const dismissErrorPanel = useCallback(() => {
    setErrorPanelMessage(null);
  }, []);

  return (
    <div
      className="editorContent ons-u-mb-l"
      data-testid={`${questionnaire.questionnaireName}-editorContent`}
    >
      {errorPanelMessage && (
        <Panel status="error">
          <p>{errorPanelMessage}</p>
          <div className="ons-u-mt-s">
            <Button
              label="Dismiss"
              primary={false}
              small
              onClick={dismissErrorPanel}
            />
          </div>
        </Panel>
      )}
      <br />
      <Select
        id="filter-cases"
        label="Filter cases"
        onChange={(e) => setStatus(e.target.value)}
        options={[
          {
            label: "All",
            value: "",
          },
          {
            label: "In progress",
            value: "In progress",
          },
          {
            label: "Queried",
            value: "Queried",
          },
          {
            label: "Completed",
            value: "Completed",
          },
          {
            label: "Not started",
            value: "Not started",
          },
        ]}
        value={status}
      />
      <br />
      <Table
        columns={["Case ID", "Status", ""]}
        id={`${questionnaire.questionnaireName}-Case-table`}
      >
        <>
          {editorInformation.Cases.filter((c) =>
            status.length > 0 ? c.EditStatus === status : true,
          ).map((caseDetails) => (
            <tr
              className="ons-table__row"
              key={caseDetails.CaseId}
            >
              <td
                className="ons-col-2@m ons-table__cell"
                aria-label={`${questionnaire.questionnaireName}-CaseID`}
              >
                {caseDetails.CaseId}
              </td>
              <td
                className="ons-col-2@m ons-table__cell status"
                aria-label={`${questionnaire.questionnaireName}-EditStatus`}
              >
                {caseDetails.EditStatus}
              </td>
              <td className="ons-col-8@m ons-table__cell ons-u-ta-right">
                <DownloadCaseSummaryLink
                  caseId={caseDetails.CaseId}
                  questionnaireName={questionnaire.questionnaireName}
                  onError={handleDownloadError}
                />
                {" | "}
                <Link
                  to={`/questionnaires/${questionnaire.questionnaireName}/cases/${caseDetails.CaseId}/summary`}
                >
                  View case summary
                </Link>
                {" | "}
                <Link
                  to={caseDetails.EditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Edit case
                </Link>
              </td>
            </tr>
          ))}
        </>
      </Table>
    </div>
  );
}
