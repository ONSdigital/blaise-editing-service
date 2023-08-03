import { RenderResult, act, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Outcome } from 'blaise-api-node-client';
import Router from 'react-router';
import { getListOfCases } from '../../../client/api/blaiseApi';
import { ICaseDetails } from '../../../server/interfaces/case.details.interface';
import Cases from '../../../client/pages/Cases';

// declare global vars
const questionnaireName: string = 'TEST111A';
const getCasesMock = getListOfCases as jest.Mock<Promise<ICaseDetails[]>>;
let view:RenderResult;

// declare mocks
/* eslint import/no-extraneous-dependencies: 0 */
jest.mock('../../../client/api/blaiseApi');
jest.mock('react-router', () => ({ ...jest.requireActual('react-router'), useParams: jest.fn() }));
jest.spyOn(Router, 'useParams').mockReturnValue({ questionnaireName });

describe('Given there are cases available in blaise for questionnaire', () => {
  const caseDetailsList:ICaseDetails[] = [{
    CaseId: '1',
    CaseStatus: Outcome.Completed,
    CaseLink: 'http://www.cati.com/1',
  },
  {
    CaseId: '2',
    CaseStatus: Outcome.HQRefusal,
    CaseLink: 'http://www.cati.com/2',
  },
  {
    CaseId: '3',
    CaseStatus: Outcome.DeleteRequested,
    CaseLink: 'http://www.cati.com/3',
  }];

  beforeEach(() => {
    getCasesMock.mockImplementation(() => Promise.resolve(caseDetailsList));
  });

  afterEach(() => {
    getCasesMock.mockReset();
  });

  it('should render the page correctly when cases are returned', async () => {
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

  it('should display a list of the expected questionnaires', async () => {
    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Cases />
        </BrowserRouter>,
      );
    });

    // assert
    caseDetailsList.forEach((caseDetail) => {
      expect(view.getByText(caseDetail.CaseId)).toBeInTheDocument();
      expect(view.getByText(caseDetail.CaseStatus)).toBeInTheDocument();
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
    expect(view.getByText(/try again in a few minutes/)).toBeInTheDocument();
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
