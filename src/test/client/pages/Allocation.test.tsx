import { RenderResult, act, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Router from 'react-router';
import Allocation from '../../../client/pages/Allocate';
import { AllocationDetails } from '../../../common/interfaces/surveyInterface';
import { getAllocationDetails } from '../../../client/api/NodeApi';
import { allocationDetailsMockObject } from '../../mockObjects/questionnaireAllocationMockObject';

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

describe('The allocation page should display the case allocation for the questionnaire', () => {
  afterEach(() => {
    getAllocationDetailsMock.mockReset();
  });

  it('should display the number of cases that are left to allocate to editors', async () => {
    // arrange
    getAllocationDetailsMock.mockImplementation(() => Promise.resolve(allocationDetailsMockObject));

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocation />
        </BrowserRouter>,
      );
    });

    // assert
    const infopanel = view.getByTestId('info-panel');
    expect(infopanel).toHaveTextContent(`Allocate cases for ${questionnaireName}`);
  });
});
