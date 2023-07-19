import { render, waitForElementToBeRemoved, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { IQuestionnaire, QuestionnaireListMockObject } from 'blaise-api-node-client';
import Questionnaires from '../../../client/pages/Questionnaires';
import { getQuestionnaires } from '../../../client/api/blaiseApi';

jest.mock('../../../client/api/blaiseApi');

const getQuestionnairesMock = getQuestionnaires as jest.Mock<Promise<IQuestionnaire[]>>;

describe('renders questionnaires page', () => {
  beforeEach(() => {
    getQuestionnairesMock.mockImplementation(() => Promise.resolve(QuestionnaireListMockObject));
  });

  afterEach(() => {
    getQuestionnairesMock.mockReset();
  });

  it('questionnaires list page matches Snapshot', async () => {
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

  it('Should display a list of expected questionnaires', async () => {
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
});
