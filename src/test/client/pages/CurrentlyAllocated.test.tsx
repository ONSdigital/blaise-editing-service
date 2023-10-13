import { RenderResult, act, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Router from 'react-router';
import { AllocationDetails } from '../../../common/interfaces/surveyInterface';
import { getAllocationDetails } from '../../../client/api/NodeApi';
import allocationDetailsMockObject from '../../mockObjects/questionnaireAllocationMockObject';
import CurrentlyAllocated from '../../../client/pages/CurrentlyAllocated';

// declare global vars
const questionnaireName: string = 'TEST111A';
let view:RenderResult;

// mock node api
jest.mock('../../../client/api/NodeApi');
const getAllocationDetailsMock = getAllocationDetails as jest.Mock<Promise<AllocationDetails>>;

/* eslint import/no-extraneous-dependencies: 0 */
jest.mock('react-router', () => ({ ...jest.requireActual('react-router'), useParams: jest.fn() }));
jest.spyOn(Router, 'useParams').mockReturnValue({ questionnaireName });

// inject AllocationDetails object

describe('The currently allocated page should display the case allocation for the questionnaire', () => {
  afterEach(() => {
    getAllocationDetailsMock.mockReset();
  });

  it('should display the editors allocated to cases for the questionnaire and the cases assigned', async () => {
    // arrange
    getAllocationDetailsMock.mockImplementation(() => Promise.resolve(allocationDetailsMockObject));

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <CurrentlyAllocated />
        </BrowserRouter>,
      );
    });

    // assert
    const infopanel = view.getByTestId('info-panel');
    const numberOfCasesLeftToAllocate = allocationDetailsMockObject.numberOfCases - allocationDetailsMockObject.numberOfCasesAllocated;
    expect(infopanel).toHaveTextContent(`There are ${numberOfCasesLeftToAllocate} cases left to allocate for ${questionnaireName}`);

    for (let count = 0; count < allocationDetailsMockObject.editorAllocationDetails.length; count += 1) {
      const editorName = view.getByTestId(`accordion-${count}-heading`);
      expect(editorName).toHaveTextContent(`${allocationDetailsMockObject.editorAllocationDetails[count]?.editor}`);

      const editorContent = view.getByTestId(`accordion-${count}-content`);
      const caseIdList = allocationDetailsMockObject.editorAllocationDetails[count]?.cases.join(', ');

      expect(editorContent).toHaveTextContent(caseIdList as string);
    }
  });
});
