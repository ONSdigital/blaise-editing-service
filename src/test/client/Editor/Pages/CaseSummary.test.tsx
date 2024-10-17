import { RenderResult, act, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Router from 'react-router';
import { CaseSummaryDetails } from '../../../../common/interfaces/caseInterface';
import CaseSummary from '../../../../client/Editor/Pages/CaseSummary';
import { getCaseSummary } from '../../../../client/api/NodeApi';
// import { caseSummaryDetailsMockObject } from '../../../server/mockObjects/CaseMockObject';

const caseSummaryDetailsMockObject: CaseSummaryDetails = {
  CaseId: '9001',
  OutcomeCode: '110',
  InterviewDate: new Date('2024-05-11'),
  District: 'Gwent',
  InterviewerName: 'Rich',
  NumberOfRespondents: '2',
  Household: {
    Accommodation: {
      Main: 'House/Bungalow',
      Type: 'Detached',
    },
    FloorNumber: '2',
    Status: 'Conventional',
    NumberOfBedrooms: '2',
    ReceiptOfHousingBenefit: [{
      Amount: '380',
      PeriodCode: 'One week',
    }],
    CouncilTaxBand: 'Band A',
    BusinessRoom: true,
    SelfEmployed: true,
    SelfEmployedMembers: ['1', '2'],
    IncomeSupport: true,
    IncomeSupportMembers: ['1'],
    IncomeBasedJaSupport: true,
    IncomeBasedJaSupportMembers: ['1'],
  },
  Respondents: [
    {
      PersonNumber: '1',
      RespondentName: 'Richmond Ricecake',
      BenefitUnit: '1',
      Sex: 'M',
      DateOfBirth: new Date('1980-01-15'),
      MaritalStatus: 'COH',
      Relationship: ['*', '1'],
    },
    {
      PersonNumber: '2',
      RespondentName: 'Betty Bettison',
      BenefitUnit: '1',
      Sex: 'F',
      DateOfBirth: new Date('1995-06-11'),
      MaritalStatus: 'COH',
      Relationship: ['1', '*'],
    },
  ],
};

// declare global vars
const questionnaireName: string = 'TEST111A';
const caseId: string = '1';
let view:RenderResult;

// declare mocks
/* eslint import/no-extraneous-dependencies: 0 */
jest.mock('react-router', () => ({ ...jest.requireActual('react-router'), useParams: jest.fn() }));
jest.spyOn(Router, 'useParams').mockReturnValue({ questionnaireName, caseId });
jest.mock('../../../../client/api/NodeApi');
const getCaseSummaryDetailsMock = getCaseSummary as jest.Mock<Promise<CaseSummaryDetails>>;

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
    expect(view).toMatchSnapshot();
  });
});

/* describe('Given there the blaise rest api is not available', () => {
  beforeEach(() => {
    getCaseSummaryDetailsMock.mockRejectedValue(new Error('try again in a few minutes'));
  });

  afterEach(() => {
    getCaseSummaryDetailsMock.mockReset();
  });

  it('should display an error message telling the user to try again in a few minutes', async () => {
    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <CaseSummary />
        </BrowserRouter>,
      );
    });

    // assert
    const summaryView = view.getByTestId('Summary');
    expect(summaryView).toHaveTextContent('try again in a few minutes');
  });

  it('should render the page correctly when an error occurs', async () => {
    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <CaseSummary />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot();
  });
});
 */
