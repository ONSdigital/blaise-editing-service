import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { ONSPanel, ONSTable } from 'blaise-design-system-react-components';
import { QuestionnaireDetails } from '../../../common/interfaces/surveyInterface';
import { SupervisorInformation } from '../../Interfaces/supervisorInterface';

interface SupervisorContentProps {
  questionnaire: QuestionnaireDetails;
  supervisorInformation: SupervisorInformation;
}

export default function SupervisorContent({ questionnaire, supervisorInformation }: SupervisorContentProps): ReactElement {
  return (
    <div className="questionnaire">
      <ONSPanel status="info">
        <dl
          className="ons-metadata ons-metadata__list ons-grid ons-grid--gutterless ons-u-cf ons-u-mb-no"
          title="Questionnares"
          data-testid={`${questionnaire.questionnaireName}-supervisor-Content`}
          style={{ padding: '0 0 15px 5px' }}
        >
          <dt className="ons-description-list__term ons-grid__col ons-col-5@m">Field period:</dt>
          <dd className="ons-description-list__value ons-grid__col ons-col-7@m">{questionnaire.fieldPeriod}</dd>
          <dt className="ons-description-list__term ons-grid__col ons-col-5@m">Total number of cases:</dt>
          <dd className="ons-description-list__value ons-grid__col ons-col-7@m">{supervisorInformation.TotalNumberOfCases}</dd>
          <dt className="ons-description-list__term ons-grid__col ons-col-5@m">Number of cases not allocated:</dt>
          <dd className="ons-description-list__value ons-grid__col ons-col-7@m">{supervisorInformation.NumberOfCasesNotAllocated}</dd>
          <dt className="ons-description-list__term ons-grid__col ons-col-5@m">Number of cases allocated:</dt>
          <dd className="ons-description-list__value ons-grid__col ons-col-7@m">{supervisorInformation.NumberOfCasesAllocated}</dd>
          <dt className="ons-description-list__term ons-grid__col ons-col-5@m">Number of cases completed:</dt>
          <dd className="ons-description-list__value ons-grid__col ons-col-7@m">{supervisorInformation.NumberOfCasesCompleted}</dd>
        </dl>
      </ONSPanel>
      <br />
      <ONSTable
        columns={[
          'Editor',
          'Allocated',
          'Completed',
          'Queried',
        ]}
        tableID={`${questionnaire.questionnaireName}-editor-table`}
      >
        <>
          {supervisorInformation.EditorInformation.map((editor) => (
            <tr
              className="ons-table__row"
              key={editor.EditorName}
            >
              <td className="ons-table__cell" aria-label={`${questionnaire.questionnaireName}-Editor`}>
                {editor.EditorName}
              </td>
              <td className="ons-table__cell status" aria-label={`${questionnaire.questionnaireName}-NumberOfCasesAllocated`}>
                {editor.NumberOfCasesAllocated}
              </td>
              <td className="ons-table__cell " aria-label={`${questionnaire.questionnaireName}-NumberOfCasesCompleted`}>
                {editor.NumberOfCasesCompleted}
              </td>
              <td className="ons-table__cell " aria-label={`${questionnaire.questionnaireName}-NumberOfCasesQueried`}>
                {editor.NumberOfCasesQueried}
              </td>
            </tr>
          ))}
          <tr
            className="ons-table__row"
            key="allocate-editor"
          >
            <td className="ons-table__cell">
              <Link to={`/questionnaires/${questionnaire.questionnaireName}/allocate`}>Allocate</Link>
              {' | '}
              <Link to={`/questionnaires/${questionnaire.questionnaireName}/reallocate`}>Reallocate</Link>
              {' | '}
              <Link to={`/questionnaires/${questionnaire.questionnaireName}/cases/search`}>Search</Link>
            </td>
            <td className="ons-table__cell" aria-label="1" />
            <td className="ons-table__cell" aria-label="2" />
            <td className="ons-table__cell" aria-label="3" />
          </tr>
        </>
      </ONSTable>
    </div>
  );
}
