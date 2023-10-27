import { RenderResult, act, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Router from 'react-router';
import Cases from '../../../client/Editor/Pages/Cases';
import { getCases } from '../../../client/Common/api/NodeApi';
import { CaseDetails } from '../../../common/interfaces/caseInterface';
import userMockObject from '../../mockObjects/userMockObject';

// declare global vars
const questionnaireName: string = 'TEST111A';
let view:RenderResult;

// declare mocks
/* eslint import/no-extraneous-dependencies: 0 */
jest.mock('react-router', () => ({ ...jest.requireActual('react-router'), useParams: jest.fn() }));
jest.spyOn(Router, 'useParams').mockReturnValue({ questionnaireName });

jest.mock('../../../client/Common/api/NodeApi');
const getCasesMock = getCases as jest.Mock<Promise<CaseDetails[]>>;

describe('Given there are cases available in blaise for questionnaire', () => {
  const caseDetailsList:CaseDetails[] = [
    {
      CaseId: '9001',
      CaseStatus: 110,
      EditorAllocated: 'rrice',
      EditCaseLink: 'https://cati.blaise.com/OPN2211A?Mode=CAWI&KeyValue=9001',
    },
    {
      CaseId: '9002',
      CaseStatus: 210,
      EditorAllocated: '',
      EditCaseLink: 'https://cati.blaise.com/OPN2211A?Mode=CAWI&KeyValue=9002',
    },
    {
      CaseId: '9003',
      CaseStatus: 0,
      EditorAllocated: 'bedgar',
      EditCaseLink: 'https://cati.blaise.com/OPN2211A?Mode=CAWI&KeyValue=9003',
    },
  ];

  afterEach(() => {
    getCasesMock.mockReset();
  });

  it('should render the page correctly when x cases are returned', async () => {
    // arrange

    getCasesMock.mockImplementation(() => Promise.resolve(caseDetailsList));

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Cases user={userMockObject} />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot();
  });

  it('should display a list of the expected questionnaires of x cases', async () => {
    // arrange
    getCasesMock.mockImplementation(() => Promise.resolve(caseDetailsList));

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Cases user={userMockObject} />
        </BrowserRouter>,
      );
    });

    // assert

    caseDetailsList.forEach((caseDetail, caseIndex) => {
      const caseListView = view.getByTestId(`case-table-row${caseIndex}`);
      expect(caseListView).toHaveTextContent(caseDetail.CaseId);
      expect(caseListView).toHaveTextContent(String(caseDetail.CaseStatus));
      expect(view.getByRole('link', { name: caseDetail.CaseId })).toHaveAttribute('href', caseDetail.EditCaseLink);
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
          <Cases user={userMockObject} />
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
          <Cases user={userMockObject} />
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
          <Cases user={userMockObject} />
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
          <Cases user={userMockObject} />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot();
  });
});
