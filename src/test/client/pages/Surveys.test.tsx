import { render, act, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { getSurveys } from '../../../client/api/blaiseApi';
import { Survey } from '../../../common/interfaces/surveyInterface';
import surveyListMockObject from '../../mockObjects/surveyListMockObject';
import Surveys from '../../../client/pages/Surveys';

jest.mock('../../../client/api/blaiseApi');

const getSurveysMock = getSurveys as jest.Mock<Promise<Survey[]>>;
let view:RenderResult;

describe('Given there are surveys available in blaise', () => {
  beforeEach(() => {
    getSurveysMock.mockImplementation(() => Promise.resolve(surveyListMockObject));
  });

  afterEach(() => {
    getSurveysMock.mockReset();
  });

  it('should render the page correctly when surveys are returned', async () => {
    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Surveys />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot();
  });

  it('should display a list of the expected surveys', async () => {
    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Surveys />
        </BrowserRouter>,
      );
    });

    // assert
    surveyListMockObject.forEach((survey, surveyIndex) => {
      const surveyListView = view.getByTestId(`accordion-${surveyIndex}-heading`);
      expect(surveyListView).toHaveTextContent(survey.name);

      survey.questionnaires.forEach(({ name, dataRecordCount }) => {
        const questionnaireListView = view.getByTestId(`accordion-${surveyIndex}-content`);
        expect(questionnaireListView).toHaveTextContent(name);
        expect(questionnaireListView).toHaveTextContent(String(dataRecordCount));
      });
    });
  });
});

describe('Given there are no surveys available in blaise', () => {
  beforeEach(() => {
    getSurveysMock.mockImplementation(() => Promise.resolve([]));
  });

  afterEach(() => {
    getSurveysMock.mockReset();
  });

  it('should render the page correctly when no surveys are returned', async () => {
    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Surveys />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot();
  });

  it('should display a message telling the user there are no surveys', async () => {
    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Surveys />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view.getByText(/There are no surveys available/)).toBeInTheDocument();
  });
});

describe('Given there the blaise rest api is not available', () => {
  beforeEach(() => {
    getSurveysMock.mockRejectedValue(new Error('try again in a few minutes'));
  });

  afterEach(() => {
    getSurveysMock.mockReset();
  });

  it('should display an error message telling the user to try again in a few minutes', async () => {
    // act
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Surveys />
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
          <Surveys />
        </BrowserRouter>,
      );
    });

    // assert
    expect(view).toMatchSnapshot();
  });
});
