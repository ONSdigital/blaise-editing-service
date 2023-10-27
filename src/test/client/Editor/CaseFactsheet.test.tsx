import { RenderResult, act, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Router from 'react-router';
import { CaseFactsheetDetails } from '../../../common/interfaces/caseInterface';
import CaseFactsheet from '../../../client/Editor/Pages/CaseFactsheet';
import { caseFactsheetMockObject } from '../../mockObjects/caseMockObject';
import { getCaseFactsheet } from '../../../client/Common/api/NodeApi';

// declare global vars
const questionnaireName: string = 'TEST111A';
const caseId: string = '1';
let view:RenderResult;

// declare mocks
/* eslint import/no-extraneous-dependencies: 0 */
jest.mock('react-router', () => ({ ...jest.requireActual('react-router'), useParams: jest.fn() }));
jest.spyOn(Router, 'useParams').mockReturnValue({ questionnaireName, caseId });
jest.mock('../../../client/Common/api/NodeApi');
const getCaseFactsheetMock = getCaseFactsheet as jest.Mock<Promise<CaseFactsheetDetails>>;

describe('Given there is a case available in blaise for a questionnaire', () => {
  afterEach(() => {
    getCaseFactsheetMock.mockReset();
  });

  it('should render the factsheet page for the case correctly', async () => {
    // arrange
    const expectedCaseFactsheet: CaseFactsheetDetails = caseFactsheetMockObject;

    getCaseFactsheetMock.mockImplementation(() => Promise.resolve(expectedCaseFactsheet));

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <CaseFactsheet />
        </BrowserRouter>,
      );
    });

    // assert
    const caseFactSheetView = view.getByTestId('Factsheet');
    expect(caseFactSheetView).toHaveTextContent(expectedCaseFactsheet.CaseId);
    expect(caseFactSheetView).toHaveTextContent(expectedCaseFactsheet.Address.AddressLine1);
    expect(caseFactSheetView).toHaveTextContent(expectedCaseFactsheet.Address.AddressLine2);
    expect(caseFactSheetView).toHaveTextContent(expectedCaseFactsheet.Address.AddressLine3);
    expect(caseFactSheetView).toHaveTextContent(expectedCaseFactsheet.Address.AddressLine4);
    expect(caseFactSheetView).toHaveTextContent(expectedCaseFactsheet.Address.County);
    expect(caseFactSheetView).toHaveTextContent(expectedCaseFactsheet.Address.Postcode);
    expect(caseFactSheetView).toHaveTextContent(expectedCaseFactsheet.Address.Town);
    expect(caseFactSheetView).toHaveTextContent(expectedCaseFactsheet.InterviewerName);
    expect(caseFactSheetView).toHaveTextContent(String(expectedCaseFactsheet.NumberOfRespondents));
    expect(caseFactSheetView).toHaveTextContent(String(expectedCaseFactsheet.OutcomeCode));
    expectedCaseFactsheet.Respondents.forEach((respondent) => {
      expect(caseFactSheetView).toHaveTextContent(respondent.RespondentName);
      expect(caseFactSheetView).toHaveTextContent(String(respondent.DateOfBirth));
    });
  });

  it('should display the factsheet correctly', async () => {
    // arrange
    const expectedCaseFactsheet: CaseFactsheetDetails = caseFactsheetMockObject;

    getCaseFactsheetMock.mockImplementation(() => Promise.resolve(expectedCaseFactsheet));

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <CaseFactsheet />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot();
  });
});

describe('Given there the blaise rest api is not available', () => {
  beforeEach(() => {
    getCaseFactsheetMock.mockRejectedValue(new Error('try again in a few minutes'));
  });

  afterEach(() => {
    getCaseFactsheetMock.mockReset();
  });

  it('should display an error message telling the user to try again in a few minutes', async () => {
    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <CaseFactsheet />
        </BrowserRouter>,
      );
    });

    // assert
    const factsheetView = view.getByTestId('Factsheet');
    expect(factsheetView).toHaveTextContent('try again in a few minutes');
  });

  it('should render the page correctly when an error occurs', async () => {
    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <CaseFactsheet />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot();
  });
});
