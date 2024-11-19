import {
  render, act, RenderResult, fireEvent,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Router from 'react-router';
import { getAllocationDetails, updateAllocationDetails } from '../../../../client/api/NodeApi';
import UserRole from '../../../../client/Common/enums/UserTypes';
import { AllocationDetails } from '../../../../common/interfaces/allocationInterface';
import AllocationMockObject from '../../MockObjects/AllocationMockObjects';
import Allocate from '../../../../client/Supervisor/Pages/Allocate';

// set global vars
const supervisorRole:UserRole = UserRole.SVT_Supervisor;
const editorRole:UserRole = UserRole.SVT_Editor;
const questionnaireName = 'FRS2504A';
let view:RenderResult;

// set mocks
/* eslint import/no-extraneous-dependencies: 0 */
jest.mock('react-router', () => ({ ...jest.requireActual('react-router'), useParams: jest.fn() }));
jest.spyOn(Router, 'useParams').mockReturnValue({ questionnaireName });

jest.mock('../../../../client/api/NodeApi');
const getAllocationDetailsMock = getAllocationDetails as jest.Mock<Promise<AllocationDetails>>;
const updateAllocationDetailsMock = updateAllocationDetails as jest.Mock<Promise<void>>;

describe('Given we wish to allocte cases from an Interviewer to an Editor', () => {
  const reallocate = false;

  beforeEach(() => {
    getAllocationDetailsMock.mockReturnValue(Promise.resolve(AllocationMockObject));
    updateAllocationDetailsMock.mockResolvedValue();
  });

  afterEach(() => {
    getAllocationDetailsMock.mockReset();
    updateAllocationDetailsMock.mockReset();
  });

  it('should render the allocation page correctly', async () => {
    // arrange && act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate supervisorRole={supervisorRole} editorRole={editorRole} reallocate={reallocate} />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot();
  });

  it('should display an have the correct page info for allocation', async () => {
    // arrange && act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate supervisorRole={supervisorRole} editorRole={editorRole} reallocate={reallocate} />
        </BrowserRouter>,
      );
    });

    // assert
    const panelView = view.getByTestId('allocation-page-panel');
    expect(panelView).toHaveTextContent('Allocate cases from an interviewer to an editor. All cases conducted by that interviewer will be allocated to the editor');
  });

  it('should display alist of availiable interviewer for alloction from', async () => {
    // arrange && act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate supervisorRole={supervisorRole} editorRole={editorRole} reallocate={reallocate} />
        </BrowserRouter>,
      );
    });

    // assert
    const interviewerListOption = view.getByTestId('select-from');
    expect(interviewerListOption.childElementCount).toEqual(AllocationMockObject.Interviewers.length + 1);

    expect(interviewerListOption.children[0]).toHaveTextContent('Select an option');
    AllocationMockObject.Interviewers.forEach((interviewer, interviewerIndex) => {
      expect(interviewerListOption.children[interviewerIndex + 1]).toHaveTextContent(`${interviewer.Name} (${interviewer.Cases.length} case(s))`);
    });
  });

  it('should display alist of availiable editors for alloction to', async () => {
    // arrange && act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate supervisorRole={supervisorRole} editorRole={editorRole} reallocate={reallocate} />
        </BrowserRouter>,
      );
    });

    // assert
    const editorListOption = view.getByTestId('select-to');
    expect(editorListOption.childElementCount).toEqual(AllocationMockObject.Editors.length + 1);

    expect(editorListOption.children[0]).toHaveTextContent('Select an option');
    AllocationMockObject.Editors.forEach((Editor, editorIndex) => {
      expect(editorListOption.children[editorIndex + 1]).toHaveTextContent(`${Editor.Name} (${Editor.Cases.length} case(s))`);
    });
  });

  it('should call updateAllocationDetails with the expected parameters when the allocation button is clicked', async () => {
    // arrange
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate supervisorRole={supervisorRole} editorRole={editorRole} reallocate={reallocate} />
        </BrowserRouter>,
      );
    });

    // act
    await act(async () => {
      fireEvent.change(view.getByTestId('select-from'), { target: { value: 'jamester' } });
      fireEvent.change(view.getByTestId('select-to'), { target: { value: 'Jake' } });
      fireEvent.click(view.getByText('Allocate'));
    });

    // assert
    expect(updateAllocationDetailsMock).toBeCalledWith(questionnaireName, 'Jake', ['10001013']);
  });

  it('should call updateAllocationDetails with the expected parameters when the allocation button is clicked is clicked and number of cases is limited to 1', async () => {
    // arrange
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate supervisorRole={supervisorRole} editorRole={editorRole} reallocate={reallocate} />
        </BrowserRouter>,
      );
    });

    // act
    await act(async () => {
      fireEvent.change(view.getByTestId('select-from'), { target: { value: 'bob' } });
      fireEvent.change(view.getByTestId('select-to'), { target: { value: 'Jake' } });
      fireEvent.change(view.getByTestId('number-of-cases'), { target: { value: '1' } });
      fireEvent.click(view.getByText('Allocate'));
    });

    // assert
    expect(updateAllocationDetailsMock).toBeCalledWith(questionnaireName, 'Jake', ['10001011']);
  });

  it('should show a success message when allocation is successful', async () => {
    // arrange
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate supervisorRole={supervisorRole} editorRole={editorRole} reallocate={reallocate} />
        </BrowserRouter>,
      );
    });

    // act
    await act(async () => {
      fireEvent.change(view.getByTestId('select-from'), { target: { value: 'jamester' } });
      fireEvent.change(view.getByTestId('select-to'), { target: { value: 'Jake' } });
      fireEvent.click(view.getByText('Allocate'));
    });

    // assert
    const successMessage = view.getByTestId('SuccessMessage');
    expect(successMessage).toHaveTextContent(`Case(s) '10001013' have been allocated to 'Jake' for '${questionnaireName}'`);

    expect(view.queryByTestId('ErrorMessage')).not.toBeInTheDocument();
  });

  it('should show an error message when allocation is not successful', async () => {
    // arrange
    updateAllocationDetailsMock.mockRejectedValue(new Error('Could not allocate cases'));

    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate supervisorRole={supervisorRole} editorRole={editorRole} reallocate={reallocate} />
        </BrowserRouter>,
      );
    });

    // act
    await act(async () => {
      fireEvent.change(view.getByTestId('select-from'), { target: { value: 'jamester' } });
      fireEvent.change(view.getByTestId('select-to'), { target: { value: 'Jake' } });
      fireEvent.click(view.getByText('Allocate'));
    });

    // assert
    const errorMessage = view.getByTestId('ErrorMessage');
    expect(errorMessage).toHaveTextContent('Case(s) could not be allocated, please try again in a few seconds');

    expect(view.queryByTestId('SuccessMessage')).not.toBeInTheDocument();
  });
});

describe('Given we wish to reallocte cases from an Editor to another Editor', () => {
  const reallocate = true;

  beforeEach(() => {
    getAllocationDetailsMock.mockReturnValue(Promise.resolve(AllocationMockObject));
    updateAllocationDetailsMock.mockResolvedValue();
  });

  afterEach(() => {
    getAllocationDetailsMock.mockReset();
    updateAllocationDetailsMock.mockReset();
  });

  it('should render the allocation page correctly', async () => {
    // arrange && act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate supervisorRole={supervisorRole} editorRole={editorRole} reallocate={reallocate} />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot();
  });

  it('should display an have the correct page info for reallocation', async () => {
    // arrange && act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate supervisorRole={supervisorRole} editorRole={editorRole} reallocate={reallocate} />
        </BrowserRouter>,
      );
    });

    // assert
    const panelView = view.getByTestId('allocation-page-panel');
    expect(panelView).toHaveTextContent('Reallocate cases from one editor to another editor. All non-completed cases will be transfered');
  });

  it('should display a list of editors for realloction from', async () => {
    // arrange && act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate supervisorRole={supervisorRole} editorRole={editorRole} reallocate={reallocate} />
        </BrowserRouter>,
      );
    });

    // assert
    const editorListOption = view.getByTestId('select-from');
    expect(editorListOption.childElementCount).toEqual(AllocationMockObject.Editors.length + 1);

    expect(editorListOption.children[0]).toHaveTextContent('Select an option');
    AllocationMockObject.Editors.forEach((editor, editorIndex) => {
      expect(editorListOption.children[editorIndex + 1]).toHaveTextContent(`${editor.Name} (${editor.Cases.length} case(s))`);
    });
  });

  it('should display a list of availiable editors for realloction to', async () => {
    // arrange && act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate supervisorRole={supervisorRole} editorRole={editorRole} reallocate={reallocate} />
        </BrowserRouter>,
      );
    });

    // assert
    const editorListOption = view.getByTestId('select-to');
    expect(editorListOption.childElementCount).toEqual(AllocationMockObject.Editors.length + 1);

    expect(editorListOption.children[0]).toHaveTextContent('Select an option');
    AllocationMockObject.Editors.forEach((Editor, editorIndex) => {
      expect(editorListOption.children[editorIndex + 1]).toHaveTextContent(`${Editor.Name} (${Editor.Cases.length} case(s))`);
    });
  });

  it('should call updateAllocationDetails with the expected parameters when the allocation button is clicked', async () => {
    // arrange
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate supervisorRole={supervisorRole} editorRole={editorRole} reallocate={reallocate} />
        </BrowserRouter>,
      );
    });

    // act
    await act(async () => {
      fireEvent.change(view.getByTestId('select-from'), { target: { value: 'Jake' } });
      fireEvent.change(view.getByTestId('select-to'), { target: { value: 'Rich' } });
      fireEvent.click(view.getByText('Reallocate'));
    });

    // assert
    expect(updateAllocationDetailsMock).toBeCalledWith(questionnaireName, 'Rich', ['10001012', '10001015']);
  });

  it('should call updateAllocationDetails with the expected parameters when the allocation button is clicked and number of cases is limited to 1', async () => {
    // arrange
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate supervisorRole={supervisorRole} editorRole={editorRole} reallocate={reallocate} />
        </BrowserRouter>,
      );
    });

    // act
    await act(async () => {
      fireEvent.change(view.getByTestId('select-from'), { target: { value: 'Jake' } });
      fireEvent.change(view.getByTestId('select-to'), { target: { value: 'Rich' } });
      fireEvent.change(view.getByTestId('number-of-cases'), { target: { value: '1' } });
      fireEvent.click(view.getByText('Reallocate'));
    });

    // assert
    expect(updateAllocationDetailsMock).toBeCalledWith(questionnaireName, 'Rich', ['10001012']);
  });

  it('should show a success message when reallocation is successful', async () => {
    // arrange
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate supervisorRole={supervisorRole} editorRole={editorRole} reallocate={reallocate} />
        </BrowserRouter>,
      );
    });

    // act
    await act(async () => {
      fireEvent.change(view.getByTestId('select-from'), { target: { value: 'Jake' } });
      fireEvent.change(view.getByTestId('select-to'), { target: { value: 'Rich' } });
      fireEvent.click(view.getByText('Reallocate'));
    });

    // assert
    const successMessage = view.getByTestId('SuccessMessage');
    expect(successMessage).toHaveTextContent(`Case(s) '10001012, 10001015' have been allocated to 'Rich' for '${questionnaireName}'`);

    expect(view.queryByTestId('ErrorMessage')).not.toBeInTheDocument();
  });

  it('should show an error message when allocation is not successful', async () => {
    // arrange
    updateAllocationDetailsMock.mockRejectedValue(new Error('Could not allocate cases'));

    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate supervisorRole={supervisorRole} editorRole={editorRole} reallocate={reallocate} />
        </BrowserRouter>,
      );
    });

    // act
    await act(async () => {
      fireEvent.change(view.getByTestId('select-from'), { target: { value: 'Jake' } });
      fireEvent.change(view.getByTestId('select-to'), { target: { value: 'Rich' } });
      fireEvent.click(view.getByText('Reallocate'));
    });

    // assert
    const errorMessage = view.getByTestId('ErrorMessage');
    expect(errorMessage).toHaveTextContent('Case(s) could not be allocated, please try again in a few seconds');

    expect(view.queryByTestId('SuccessMessage')).not.toBeInTheDocument();
  });
});
