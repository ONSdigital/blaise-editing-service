import { RenderResult, act, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Router from 'react-router';
import Cases from '../../../client/pages/Cases';
import CaseDetailsBuilder from '../../builders/caseDetailsBuilder';
import { getCases } from '../../../client/clients/NodeApi';
import { CaseDetails } from '../../../common/interfaces/caseInterface';

// declare global vars
const questionnaireName: string = 'TEST111A';
let view:RenderResult;

// declare mocks
/* eslint import/no-extraneous-dependencies: 0 */
jest.mock('react-router', () => ({ ...jest.requireActual('react-router'), useParams: jest.fn() }));
jest.spyOn(Router, 'useParams').mockReturnValue({ questionnaireName });

jest.mock('../../../client/clients/NodeApi');
const getCasesMock = getCases as jest.Mock<Promise<CaseDetails[]>>;

describe('Given there are cases available in blaise for questionnaire', () => {
  afterEach(() => {
    getCasesMock.mockReset();
  });

  it.each([1, 2, 3, 4])('should render the page correctly when x cases are returned', async (value) => {
    // arrange
    const caseDetailsBuider = new CaseDetailsBuilder(value);
    const caseDetailsListMockObject = caseDetailsBuider.BuildCaseDetails();

    getCasesMock.mockImplementation(() => Promise.resolve(caseDetailsListMockObject));

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Cases />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot();
  });

  it.each([1, 2, 3, 4])('should display a list of the expected questionnaires of x cases', async (value) => {
    // arrange
    const caseDetailsBuider = new CaseDetailsBuilder(value);
    const caseDetailsListMockObject = caseDetailsBuider.BuildCaseDetails();
    getCasesMock.mockImplementation(() => Promise.resolve(caseDetailsListMockObject));

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Cases />
        </BrowserRouter>,
      );
    });

    // assert

    caseDetailsListMockObject.forEach((caseDetail, caseIndex) => {
      const caseListView = view.getByTestId(`case-table-row${caseIndex}`);
      expect(caseListView).toHaveTextContent(caseDetail.CaseId);
      expect(caseListView).toHaveTextContent(String(caseDetail.CaseStatus));
      expect(view.getByRole('link', { name: caseDetail.CaseId })).toHaveAttribute('href', caseDetail.CaseLink);
    });
  });
});

describe('Given there are no cases available in blaise for questionnaire', () => {
  beforeEach(() => {
    getCasesMock.mockImplementation(() => Promise.resolve([]));
  });

  afterEach(() => {
    getCasesMock.mockReset();
  });

  it('should render the page correctly when no cases are returned', async () => {
    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Cases />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot();
  });

  it('should display a message "There are no cases available"', async () => {
    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Cases />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view.getByText(/There are no cases available/)).toBeInTheDocument();
  });
});

describe('Given there the blaise rest api is not available', () => {
  beforeEach(() => {
    getCasesMock.mockRejectedValue(new Error('try again in a few minutes'));
  });

  afterEach(() => {
    getCasesMock.mockReset();
  });

  it('should display an error message telling the user to try again in a few minutes', async () => {
    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Cases />
        </BrowserRouter>,
      );
    });

    // assert
    const casesView = view.getByTestId('Cases');
    expect(casesView).toHaveTextContent('try again in a few minutes');
  });

  it('should render the page correctly when an error occurs', async () => {
    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Cases />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot();
  });
});
