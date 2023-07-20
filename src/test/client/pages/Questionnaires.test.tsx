import { render, waitForElementToBeRemoved, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { IQuestionnaire, QuestionnaireListMockObject } from 'blaise-api-node-client';
import Questionnaires from '../../../client/pages/Questionnaires';
import { getQuestionnaires } from '../../../client/api/blaiseApi';

jest.mock('../../../client/api/blaiseApi');

const getQuestionnairesMock = getQuestionnaires as jest.Mock<Promise<IQuestionnaire[]>>;

describe('Given there are questionnaires available in blaise', () => {
  beforeEach(() => {
    getQuestionnairesMock.mockImplementation(() => Promise.resolve(QuestionnaireListMockObject));
  });

  afterEach(() => {
    getQuestionnairesMock.mockReset();
  });

  it('should render the page correctly', async () => {
    // act
    const wrapper = render(
      <BrowserRouter>
        <Questionnaires />
      </BrowserRouter>,
    );

    await waitForElementToBeRemoved(screen.getByText('Loading...'));

    // assert
    expect(wrapper).toMatchSnapshot();
  });

  it('should display a list of the expected questionnaires', async () => {
    // act
    const { queryByText } = render(
      <BrowserRouter>
        <Questionnaires />
      </BrowserRouter>,
    );

    await waitForElementToBeRemoved(screen.getByText('Loading...'));

    // assert
    QuestionnaireListMockObject.forEach((questionnaire) => {
      expect(queryByText(questionnaire.name)).toBeInTheDocument();
    });
  });

  describe('Given there are no questionnaires available in blaise', () => {
    it('should display a message telling the user there are no questionnaires', async () => {
      // arrange
      // set mock to return an empty array

      // act
      // render the page

      // assert
      // check the message is on the screen
      // check the message is on the screen and that it is in an information panel maybe? Snapshot test as well?
    });
  });

  // this one test should be enough cover all error scenarios - the granular errors can be tested against the blaise api file
  describe('Given there the blaise rest api is not available', () => {
    it('should display an error message telling the user to try again in a few minutes', async () => {
      // arrange
      // set mock to throw an error with the message

      // act
      // render the page

      // assert
      // check the message is on the screen and that it is in an error panel maybe? Snapshot test as well?
    });
  });
});
