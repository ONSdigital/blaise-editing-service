import { type SummaryGroup, SummaryGroupTable, Table } from "blaise-design-system-react-components";
import { Link } from "react-router-dom";

import type { QuestionnaireDetails } from "../../../../common/types/survey.types";
import type { SupervisorInformation } from "../../../types/supervisor.types";
import type { ReactElement } from "react";

interface SupervisorContentProps {
  questionnaire: QuestionnaireDetails;
  supervisorInformation: SupervisorInformation;
}

export default function SupervisorContent({
  questionnaire,
  supervisorInformation,
}: SupervisorContentProps): ReactElement {
  const groupedSummary: SummaryGroup[] = [
    {
      title: "Case status",
      records: {
        "Total cases": supervisorInformation.TotalNumberOfCases,
        "Unallocated cases": supervisorInformation.NumberOfCasesNotAllocated,
        "Allocated cases": supervisorInformation.NumberOfCasesAllocated,
        "Completed cases": supervisorInformation.NumberOfCasesCompleted,
      },
    },
  ];

  return (
    <div className="questionnaire">
      <div data-testid={`${questionnaire.questionnaireName}-supervisor-Content`}>
        <SummaryGroupTable
          id={`${questionnaire.questionnaireName}-supervisor-summary`}
          groupedSummary={groupedSummary}
          className="ons-u-mt-m ons-u-mb-m"
        />
      </div>

      <Table
        columns={["Editor", "Allocated", "Completed", "Queried"]}
        id={`${questionnaire.questionnaireName}-editor-table`}
      >
        <>
          {supervisorInformation.EditorInformation.map((editor) => (
            <tr
              className="ons-table__row"
              key={editor.EditorName}
            >
              <td
                className="ons-table__cell"
                aria-label={`${questionnaire.questionnaireName}-Editor`}
              >
                {editor.EditorName}
              </td>
              <td
                className="ons-table__cell status"
                aria-label={`${questionnaire.questionnaireName}-NumberOfCasesAllocated`}
              >
                {editor.NumberOfCasesAllocated}
              </td>
              <td
                className="ons-table__cell "
                aria-label={`${questionnaire.questionnaireName}-NumberOfCasesCompleted`}
              >
                {editor.NumberOfCasesCompleted}
              </td>
              <td
                className="ons-table__cell "
                aria-label={`${questionnaire.questionnaireName}-NumberOfCasesQueried`}
              >
                {editor.NumberOfCasesQueried}
              </td>
            </tr>
          ))}
          <tr
            className="ons-table__row"
            key="allocate-editor"
          >
            <td className="ons-table__cell">
              <Link to={`/questionnaires/${questionnaire.questionnaireName}/allocate`}>
                Allocate
              </Link>
              {" | "}
              <Link to={`/questionnaires/${questionnaire.questionnaireName}/reallocate`}>
                Reallocate
              </Link>
              {" | "}
              <Link to={`/questionnaires/${questionnaire.questionnaireName}/cases/search`}>
                Search
              </Link>
            </td>
            <td
              className="ons-table__cell"
              aria-label="1"
            />
            <td
              className="ons-table__cell"
              aria-label="2"
            />
            <td
              className="ons-table__cell"
              aria-label="3"
            />
          </tr>
        </>
      </Table>
    </div>
  );
}
