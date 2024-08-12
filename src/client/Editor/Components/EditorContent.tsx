import { ONSPanel, ONSSelect, ONSTable } from 'blaise-design-system-react-components';
import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { EditorInformation } from '../../../common/interfaces/caseInterface';
import { QuestionnaireDetails } from '../../../common/interfaces/surveyInterface';

interface EditorsContentProps {
  editorInformation: EditorInformation;
  questionnaire: QuestionnaireDetails
}

export default function EditorContent({ editorInformation, questionnaire }: EditorsContentProps): ReactElement {
  return (
    <div className="editorContent" data-testid={`${questionnaire.questionnaireName}-editorContent`}>
      <ONSPanel status="info">
        <dl
          className="ons-metadata ons-metadata__list ons-grid ons-grid--gutterless ons-u-cf ons-u-mb-no"
          title="editorContent"
          data-testid="editorContent-dl"
          style={{ padding: '0 0 15px 5px' }}
        >
          <dt className="ons-description-list__term ons-grid__col ons-col-5@m">Field period:</dt>
          <dd className="ons-description-list__value ons-grid__col ons-col-7@m"><strong>{questionnaire.fieldPeriod}</strong></dd>
          <dt className="ons-description-list__term ons-grid__col ons-col-5@m">Cases assigned to me:</dt>
          <dd className="ons-description-list__value ons-grid__col ons-col-7@m"><strong>{editorInformation.numberOfCasesAllocated}</strong></dd>

        </dl>
      </ONSPanel>
      <ONSSelect
        defaultValue="in-progress"
        id="filter-cases"
        label="Filter cases"
        onChange={() => {}}
        options={[
          {
            label: 'In Progress',
            value: 'in-progress',
          },
          {
            label: 'Complete',
            value: 'complete',
          },
          {
            label: 'Not Started',
            value: 'not-started',
          },
        ]}
        value=""
      />

      <ONSTable
        columns={[
          'Case ID',
          'Status',
          '',
        ]}
      >
        <>
          {editorInformation.Cases.map((caseDetails) => (
            <tr
              className="ons-table__row"
              data-testid={`case-table-row-${caseDetails.CaseId}`}
              key={caseDetails.CaseId}
            >
              <td className="ons-table__cell">
                {caseDetails.CaseId}
              </td>
              <td className="ons-table__cell status">
                {caseDetails.EditStatus}
              </td>
              <td className="ons-table__cell links">
                <Link className="Edit" to="/summary">Summary</Link>
                {' | '}
                <Link className="Edit" to="/">Edit</Link>
              </td>
            </tr>
          ))}
        </>
      </ONSTable>

    </div>
  );
}