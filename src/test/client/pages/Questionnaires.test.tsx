import { render, act, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { IQuestionnaire, QuestionnaireListMockObject } from 'blaise-api-node-client';
import Questionnaires from '../../../client/pages/Questionnaires';
import { getQuestionnaires } from '../../../client/api/blaiseApi';

jest.mock('../../../client/api/blaiseApi');

const getQuestionnairesMock = getQuestionnaires as jest.Mock<Promise<IQuestionnaire[]>>;
let view:RenderResult;

describe('Given there are questionnaires available in blaise', () => {
  beforeEach(() => {
    getQuestionnairesMock.mockImplementation(() => Promise.resolve(QuestionnaireListMockObject));
  });

  afterEach(() => {
    getQuestionnairesMock.mockReset();
  });

  it('should render the page correctly when questionnaires are returned', async () => {
    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Questionnaires />
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
          <Questionnaires />
        </BrowserRouter>,
      );
    });


    // assert
    QuestionnaireListMockObject.forEach((questionnaire) => {
      expect(view.getByText(questionnaire.name)).toBeInTheDocument();
    });
  });
});

describe('Given there are no questionnaires available in blaise', () => {
  beforeEach(() => {
    getQuestionnairesMock.mockImplementation(() => Promise.resolve([]));
  });

  afterEach(() => {
    getQuestionnairesMock.mockReset();
  });

  it('should render the page correctly when no questionnaires are returned', async () => {
    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Questionnaires />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot();
  });

  it('should display a message telling the user there are no questionnaires', async () => {
    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Questionnaires />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view.getByText(/There are no questionnaires available/)).toBeInTheDocument();
  });
});

// this one test should be enough cover all error scenarios - the granular errors can be tested against the blaise api file
describe('Given there the blaise rest api is not available', () => {

  afterEach(() => {
    getQuestionnairesMock.mockReset();
  });

  it('should display an error message telling the user to try again in a few minutes', async () => {
    // arrange
    getQuestionnairesMock.mockRejectedValue(new Error("try again in a few minutes"));

    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Questionnaires />
        </BrowserRouter>,
      );
    });
    
    // assert
    expect(view.getByText(/try again in a few minutes/)).toBeInTheDocument();
   });
});
