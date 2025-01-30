import {
  render, act, RenderResult,
  fireEvent,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Router from 'react-router';
import { CaseEditInformation } from 'blaise-api-node-client';
import { getSpecificCaseEditInformation, setCaseToUpdate } from '../../../../client/api/NodeApi';
import UserRole from '../../../../client/Common/enums/UserTypes';
import EditCaseContent from '../../../../client/Common/components/EditCaseContent';
import { caseEditInformationMockObject1 } from '../../../server/mockObjects/CaseMockObject';

// set global vars
const supervisorRole:UserRole = UserRole.SVT_Supervisor;
const researcherRole:UserRole = UserRole.FRS_Research;
const supportRole:UserRole = UserRole.Survey_Support;
const questionnaireName = 'FRS2504A';
let view:RenderResult;

// set mocks
/* eslint import/no-extraneous-dependencies: 0 */
jest.mock('react-router', () => ({ ...jest.requireActual('react-router'), useParams: jest.fn() }));
jest.spyOn(Router, 'useParams').mockReturnValue({ questionnaireName, caseId: `${caseEditInformationMockObject1.primaryKey}` });

jest.mock('../../../../client/api/NodeApi');
const getSpecificCaseEditInformationMock = getSpecificCaseEditInformation as jest.Mock<Promise<CaseEditInformation>>;
const setCaseToUpdateMock = setCaseToUpdate as jest.Mock<Promise<number>>;

describe('Given we want to view the Edit Case page of a case', () => {
  beforeEach(() => {
    getSpecificCaseEditInformationMock.mockReturnValue(Promise.resolve(caseEditInformationMockObject1));
  });

  afterEach(() => {
    getSpecificCaseEditInformationMock.mockReset();
    setCaseToUpdateMock.mockReset();
  });

  it('should render the Editing page correctly for a Supervisor user', async () => {
    // arrange && act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditCaseContent role={supervisorRole} />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot(
      'EditCaseContentSupervisor',
    );
  });

  it('should display correct case details in a table format for a Supervisor user', async () => {
    // arrange && act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditCaseContent role={supervisorRole} />
        </BrowserRouter>,
      );
    });

    // assert
    const caseDetailsTable = view.getByTestId(`${caseEditInformationMockObject1.primaryKey}-case-details`);
    const editCaseLink = view.getByTestId('edit-case-link');
    expect(caseDetailsTable).toHaveTextContent(caseEditInformationMockObject1.primaryKey);
    expect(caseDetailsTable).toHaveTextContent(`${caseEditInformationMockObject1.outcome}`);
    expect(caseDetailsTable).toHaveTextContent(`${caseEditInformationMockObject1.interviewer}`);
    expect(caseDetailsTable).toHaveTextContent(`${caseEditInformationMockObject1.organisation}`);
    expect(editCaseLink).toHaveTextContent('Edit Case');
    expect(editCaseLink).toHaveAttribute('href', `${caseEditInformationMockObject1.editUrl}`);
  });

  it('should not display Update case button in Edit Case Form for a Supervisor user', async () => {
    // arrange && act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditCaseContent role={supervisorRole} />
        </BrowserRouter>,
      );
    });

    // assert
    const updateCaseButton = view.queryByTestId('button');
    expect(updateCaseButton).toBeNull();
  });

  it('should render the Editing page correctly for a Research user', async () => {
    // arrange && act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditCaseContent role={researcherRole} />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot(
      'EditCaseContentResearch',
    );
  });

  it('should display correct case details in a table format for a Research user', async () => {
    // arrange && act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditCaseContent role={researcherRole} />
        </BrowserRouter>,
      );
    });

    // assert
    const caseDetailsTable = view.getByTestId(`${caseEditInformationMockObject1.primaryKey}-case-details`);
    const editCaseLink = view.getByTestId('edit-case-link');
    expect(caseDetailsTable).toHaveTextContent(caseEditInformationMockObject1.primaryKey);
    expect(caseDetailsTable).toHaveTextContent(`${caseEditInformationMockObject1.outcome}`);
    expect(caseDetailsTable).toHaveTextContent(`${caseEditInformationMockObject1.interviewer}`);
    expect(caseDetailsTable).toHaveTextContent(`${caseEditInformationMockObject1.organisation}`);
    expect(editCaseLink).toHaveTextContent('Edit Case');
    expect(editCaseLink).toHaveAttribute('href', `${caseEditInformationMockObject1.editUrl}`);
  });

  it('should not display Update case button in Edit Case Form for a Research user', async () => {
    // arrange && act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditCaseContent role={researcherRole} />
        </BrowserRouter>,
      );
    });

    // assert
    const updateCaseButton = view.queryByTestId('button');
    expect(updateCaseButton).toBeNull();
  });

  it('should render the Editing page correctly for a Survey Support user', async () => {
    // arrange && act
    await act(async () => {
      view = render(

        <BrowserRouter>
          <EditCaseContent role={supportRole} />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot(
      'EditCaseContentSupport',
    );
  });

  it('should display correct case details in a table format for a Survey Support user', async () => {
    // arrange && act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditCaseContent role={supportRole} />
        </BrowserRouter>,
      );
    });

    // assert
    const caseDetailsTable = view.getByTestId(`${caseEditInformationMockObject1.primaryKey}-case-details`);
    const editCaseLink = view.getByTestId('edit-case-link');
    expect(caseDetailsTable).toHaveTextContent(caseEditInformationMockObject1.primaryKey);
    expect(caseDetailsTable).toHaveTextContent(`${caseEditInformationMockObject1.outcome}`);
    expect(caseDetailsTable).toHaveTextContent(`${caseEditInformationMockObject1.interviewer}`);
    expect(caseDetailsTable).toHaveTextContent(`${caseEditInformationMockObject1.organisation}`);
    expect(editCaseLink).toHaveTextContent('Edit interviewer Case');
    expect(editCaseLink).toHaveAttribute('href', `${caseEditInformationMockObject1.editUrl}`);
  });

  it('should display Update case button in Edit Case Form for a Survey Support user', async () => {
    // arrange && act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditCaseContent role={supportRole} />
        </BrowserRouter>,
      );
    });

    // assert
    const updateCaseButton = view.getByRole('button', { name: 'Update case' });
    expect(updateCaseButton).toHaveTextContent('Update case');
  });

  it('should display success message when clicking Update case button successfully for a Survey Support user', async () => {
    // arrange
    setCaseToUpdateMock.mockReturnValue(Promise.resolve(204));
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditCaseContent role={supportRole} />
        </BrowserRouter>,
      );
    });

    // act
    const updateCaseButton = view.getByRole('button', { name: 'Update case' });
    await act(async () => {
      fireEvent.click(updateCaseButton);
    });

    // assert
    const successMessage = view.getByTestId('SuccessMessage');
    expect(successMessage).toHaveTextContent(`Successfully set case with ID, ${caseEditInformationMockObject1.primaryKey}, to update editing database overnight`);
    expect(view.queryByTestId('ErrorMessage')).not.toBeInTheDocument();
  });

  it('should display Error message when clicking Update case button fails with a 404 for a Survey Support user', async () => {
    // arrange
    setCaseToUpdateMock.mockReturnValue(Promise.resolve(404));
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditCaseContent role={supportRole} />
        </BrowserRouter>,
      );
    });

    // act
    const updateCaseButton = view.getByRole('button', { name: 'Update case' });
    await act(async () => {
      fireEvent.click(updateCaseButton);
    });

    // assert
    const ErrorMessage = view.getByTestId('ErrorMessage');
    expect(ErrorMessage).toHaveTextContent(`Failed to set case with ID, ${caseEditInformationMockObject1.primaryKey}, to update, please try again in a few seconds or contact service desk to raise a support ticket`);
    expect(view.queryByTestId('SuccessMessage')).not.toBeInTheDocument();
  });

  it('should display Error message when clicking Update case button fails with a 500 for a Survey Support user', async () => {
    // arrange
    setCaseToUpdateMock.mockReturnValue(Promise.resolve(500));
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditCaseContent role={supportRole} />
        </BrowserRouter>,
      );
    });

    // act
    const updateCaseButton = view.getByRole('button', { name: 'Update case' });
    await act(async () => {
      fireEvent.click(updateCaseButton);
    });

    // assert
    const ErrorMessage = view.getByTestId('ErrorMessage');
    expect(ErrorMessage).toHaveTextContent(`Failed to set case with ID, ${caseEditInformationMockObject1.primaryKey}, to update, please try again in a few seconds or contact service desk to raise a support ticket`);
    expect(view.queryByTestId('SuccessMessage')).not.toBeInTheDocument();
  });

  it('should display Error message when clicking Update case button throws an error for a Survey Support user', async () => {
    // arrange
    setCaseToUpdateMock.mockRejectedValue(new Error('Could not Update case'));
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditCaseContent role={supportRole} />
        </BrowserRouter>,
      );
    });

    // act
    const updateCaseButton = view.getByRole('button', { name: 'Update case' });
    await act(async () => {
      fireEvent.click(updateCaseButton);
    });

    // assert
    const ErrorMessage = view.getByTestId('ErrorMessage');
    expect(ErrorMessage).toHaveTextContent(`Failed to set case with ID, ${caseEditInformationMockObject1.primaryKey}, to update, please try again in a few seconds or contact service desk to raise a support ticket`);
    expect(view.queryByTestId('SuccessMessage')).not.toBeInTheDocument();
  });
});
