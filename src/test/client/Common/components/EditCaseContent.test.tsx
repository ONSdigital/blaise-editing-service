import {
  render, act, RenderResult,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Router from 'react-router';
import { CaseEditInformation } from 'blaise-api-node-client';
import userEvent from '@testing-library/user-event';
import { getSpecificCaseEditInformation } from '../../../../client/api/NodeApi';
import UserRole from '../../../../client/Common/enums/UserTypes';
import EditCaseContent from '../../../../client/Common/components/EditCaseContent';
import { caseEditInformationMockObject1 } from '../../../server/mockObjects/CaseMockObject';

// set global vars
const supervisorRole:UserRole = UserRole.SVT_Supervisor;
const supportRole:UserRole = UserRole.Survey_Support;
const questionnaireName = 'FRS2504A';
let view:RenderResult;

// set mocks
/* eslint import/no-extraneous-dependencies: 0 */
jest.mock('react-router', () => ({ ...jest.requireActual('react-router'), useParams: jest.fn() }));
jest.spyOn(Router, 'useParams').mockReturnValue({ questionnaireName, caseId: `${caseEditInformationMockObject1.primaryKey}` });

jest.mock('../../../../client/api/NodeApi');
const getSpecificCaseEditInformationMock = getSpecificCaseEditInformation as jest.Mock<Promise<CaseEditInformation>>;

describe('Given we want to view the Edit Case page of a case', () => {
  beforeEach(() => {
    getSpecificCaseEditInformationMock.mockReturnValue(Promise.resolve(caseEditInformationMockObject1));
  });

  afterEach(() => {
    getSpecificCaseEditInformationMock.mockReset();
  });

  it('should render the allocation page correctly for a Supervisor user', async () => {
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

  it('should display correct case details in a table format', async () => {
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

  it('should render the allocation page correctly for a Survey Support user', async () => {
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
    act(() => {
      userEvent.click(updateCaseButton);
    });
    expect((await view.findByTestId('SuccessMessage')).textContent).toBe('Successfully set case with ID, 10001011, to update editing database overnight');
  });
});
