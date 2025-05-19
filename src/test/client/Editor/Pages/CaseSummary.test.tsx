import {
  describe, afterEach, it, expect,
} from 'vitest';
import { RenderResult, act, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CaseSummaryDetails } from '../../../../common/interfaces/caseInterface';
import CaseSummary from '../../../../client/Editor/Pages/CaseSummary';
import { getCaseSummary } from '../../../../client/api/NodeApi';
import { caseSummaryDetailsMockObject } from '../../../server/mockObjects/CaseMockObject';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn().mockReturnValue({
      questionnaireName: 'TEST111A',
      caseId: '1',
    }),
  };
});
vi.mock('../../../../client/api/NodeApi');

// declare global vars
let view:RenderResult;
const getCaseSummaryDetailsMock = getCaseSummary as vi.mock<Promise<CaseSummaryDetails>>;

describe('Given there is a case available in blaise for a questionnaire', () => {
  afterEach(() => {
    getCaseSummaryDetailsMock.mockReset();
  });

  it('should render the summary page for the case correctly', async () => {
    // arrange
    const expectedCaseSummaryDetails: CaseSummaryDetails = caseSummaryDetailsMockObject;

    getCaseSummaryDetailsMock.mockImplementation(() => Promise.resolve(expectedCaseSummaryDetails));

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <CaseSummary />
        </BrowserRouter>,
      );
    });

    // assert
    const caseSummaryView = view.getByTestId('Summary');
    expect(caseSummaryView).toHaveTextContent(expectedCaseSummaryDetails.CaseId);
    expect(caseSummaryView).toHaveTextContent(expectedCaseSummaryDetails.OutcomeCode);
    expect(caseSummaryView).toHaveTextContent(expectedCaseSummaryDetails.InterviewDate.toDateString());
    expect(caseSummaryView).toHaveTextContent(expectedCaseSummaryDetails.District);
    expect(caseSummaryView).toHaveTextContent(expectedCaseSummaryDetails.InterviewerName);
    expect(caseSummaryView).toHaveTextContent(`Main: ${expectedCaseSummaryDetails.Household.Accommodation.Main}`);
    expect(caseSummaryView).toHaveTextContent(`Type: ${expectedCaseSummaryDetails.Household.Accommodation.Type}`);
    expect(caseSummaryView).toHaveTextContent(expectedCaseSummaryDetails.Household.FloorNumber);
    expect(caseSummaryView).toHaveTextContent(expectedCaseSummaryDetails.Household.Status);
    expect(caseSummaryView).toHaveTextContent(expectedCaseSummaryDetails.Household.NumberOfBedrooms);
    expectedCaseSummaryDetails.Household.ReceiptOfHousingBenefit.forEach((housingBenefit) => {
      expect(caseSummaryView).toHaveTextContent(`amount: ${housingBenefit.Amount}, period: ${housingBenefit.PeriodCode}`);
    });
    expect(caseSummaryView).toHaveTextContent(expectedCaseSummaryDetails.Household.CouncilTaxBand);
    expect(caseSummaryView).toHaveTextContent('Yes');
    expect(caseSummaryView).toHaveTextContent(`Yes - H/H members: ${expectedCaseSummaryDetails.Household.SelfEmployedMembers.join(', ')}`);
    expect(caseSummaryView).toHaveTextContent(`Yes - H/H members: ${expectedCaseSummaryDetails.Household.IncomeSupportMembers.join(', ')}`);
    expect(caseSummaryView).toHaveTextContent(`Yes - H/H members: ${expectedCaseSummaryDetails.Household.IncomeBasedJaSupportMembers.join(', ')}`);

    const respondentNumberRows = view.getAllByLabelText('RespondentNumber');
    const respondentNameRows = view.getAllByLabelText('RespondentName');
    const benefitUnitRows = view.getAllByLabelText('BenefitUnit');
    const sexRows = view.getAllByLabelText('Sex');
    const dateOfBirthRows = view.getAllByLabelText('DateOfBirth');
    const maritalStatusRows = view.getAllByLabelText('MaritalStatus');

    expectedCaseSummaryDetails.Respondents.forEach((respondent, respondentIndex) => {
      expect(respondentNumberRows[respondentIndex]).toHaveTextContent(respondent.PersonNumber);
      expect(respondentNameRows[respondentIndex]).toHaveTextContent(respondent.RespondentName);
      expect(benefitUnitRows[respondentIndex]).toHaveTextContent(respondent.BenefitUnit);
      expect(sexRows[respondentIndex]).toHaveTextContent(respondent.Sex);
      expect(dateOfBirthRows[respondentIndex]).toHaveTextContent(respondent.DateOfBirth.toDateString());
      expect(maritalStatusRows[respondentIndex]).toHaveTextContent(respondent.MaritalStatus);

      const relationshipRows = view.getAllByLabelText(`Relationship-${respondent.PersonNumber}`);

      respondent.Relationship.forEach((relationship, relationshipIndex) => {
        expect(relationshipRows[relationshipIndex]).toHaveTextContent(relationship);
      });
    });
  });

  it('should display the summary correctly', async () => {
    // arrange
    const expectedCaseSummaryDetails: CaseSummaryDetails = caseSummaryDetailsMockObject;

    getCaseSummaryDetailsMock.mockImplementation(() => Promise.resolve(expectedCaseSummaryDetails));

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <CaseSummary />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot(
      'CaseSummary',
    );
  });
});
