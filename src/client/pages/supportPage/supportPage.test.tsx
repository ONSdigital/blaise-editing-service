import { act, fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { mockCaseList } from "../../../server/test-utils/case.mock";
import mockUser from "../../../server/test-utils/user.mock";
import { getCaseSearchResults, getSurveys } from "../../api/nodeApi";
import mockFilteredSurveyList from "../../test-utils/survey.mock";
import UserRole from "../../types/user.types";

import SupportHome from "./supportPage";

import type { RenderResult } from "@testing-library/react";
import type { User } from "blaise-api-node-client";

const userRole: string = UserRole.Survey_Support;
let view: RenderResult;
const makeUser = (): User => ({ ...mockUser, role: userRole });

vi.mock("../../api/nodeApi", async () => {
  const actual = await vi.importActual("../../api/nodeApi");

  return {
    ...actual,
    getSurveys: vi.fn(() => Promise.resolve([])),
    getCaseSearchResults: vi.fn(() => Promise.resolve([])),
  };
});
const mockGetSurveys = vi.mocked(getSurveys);
const mockGetCaseInformation = vi.mocked(getCaseSearchResults);

describe("Given there are surveys available in blaise", () => {
  beforeEach(() => {
    mockGetSurveys.mockImplementation(() => Promise.resolve(mockFilteredSurveyList));
    mockGetCaseInformation.mockImplementation(() => Promise.resolve(mockCaseList));
  });

  it("should render the Support page correctly when surveys are returned", async () => {
    const user = makeUser();

    await act(async () => {
      view = render(
        <BrowserRouter>
          <SupportHome user={user} />
        </BrowserRouter>,
      );
    });

    expect(view).toMatchSnapshot("SupportPageSurveysReturned");
  });

  it("should display the expected questionnaire details for the default option", async () => {
    const user = makeUser();

    await act(async () => {
      view = render(
        <BrowserRouter>
          <SupportHome user={user} />
        </BrowserRouter>,
      );
    });
    mockFilteredSurveyList.forEach((survey) => {
      const surveyListView = view.getByTestId(`survey-accordion`);

      expect(surveyListView).toHaveTextContent(survey.name);

      const questionnaireListView = view.getByTestId(`survey-accordion`);

      const defaultQuestionnaire = survey.questionnaires[0];

      if (defaultQuestionnaire === undefined) {
        throw Error("No default questionnaire found");
      }

      const defaultQuestionnaireName = defaultQuestionnaire.questionnaireName;

      expect(questionnaireListView).toHaveTextContent(
        defaultQuestionnaire.questionnaireName.replace("_EDIT", ""),
      );

      const questionnaireView = view.getByTestId(`${defaultQuestionnaireName}-Support-Content`);

      expect(questionnaireView).toHaveTextContent("Enter case ID");
      expect(questionnaireView).toHaveTextContent("Search");
    });
  });

  it("should render the Support page correctly and Search button disabled because search text not entered", async () => {
    const user = makeUser();

    await act(async () => {
      view = render(
        <BrowserRouter>
          <SupportHome user={user} />
        </BrowserRouter>,
      );
    });

    expect(view).toMatchSnapshot("SupportPageSurveysReturnedSearchInitial");
  });

  it("should render the Support page correctly and Search button enabled after search text entered", async () => {
    const user = makeUser();

    await act(async () => {
      view = render(
        <BrowserRouter>
          <SupportHome user={user} />
        </BrowserRouter>,
      );
    });

    await act(async () => {
      fireEvent.change(view.getByTestId("caseid-input"), { target: { value: "900" } });
    });

    expect(view).toMatchSnapshot("SupportPageSurveysReturnedSearchTextEntered");
  });

  it("should render the Support page correctly when surveys are returned and search used", async () => {
    const user = makeUser();

    await act(async () => {
      view = render(
        <BrowserRouter>
          <SupportHome user={user} />
        </BrowserRouter>,
      );
    });

    await act(async () => {
      fireEvent.change(view.getByTestId("caseid-input"), { target: { value: "900" } });
      fireEvent.click(view.getByText("Search"));
    });

    expect(view).toMatchSnapshot("SupportPageSurveysReturnedSearchUsed");
  });

  it("should display the expected questionnaire and case details when search used", async () => {
    const user = makeUser();

    await act(async () => {
      view = render(
        <BrowserRouter>
          <SupportHome user={user} />
        </BrowserRouter>,
      );
    });

    await act(async () => {
      fireEvent.change(view.getByTestId("caseid-input"), { target: { value: "900" } });
      fireEvent.click(view.getByText("Search"));
    });

    mockFilteredSurveyList.forEach((survey) => {
      const surveyListView = view.getByTestId(`survey-accordion`);

      expect(surveyListView).toHaveTextContent(survey.name);

      const questionnaireListView = view.getByTestId(`survey-accordion`);

      const defaultQuestionnaire = survey.questionnaires[0];

      if (defaultQuestionnaire === undefined) {
        throw Error("No default questionnaire found");
      }

      const defaultQuestionnaireName = defaultQuestionnaire.questionnaireName;

      expect(questionnaireListView).toHaveTextContent(
        defaultQuestionnaire.questionnaireName.replace("_EDIT", ""),
      );

      const questionnaireView = view.getByTestId(`${defaultQuestionnaireName}-Support-Content`);

      expect(questionnaireView).toHaveTextContent("Enter case ID");
      expect(questionnaireView).toHaveTextContent("Search");

      const caseIdRows = view.getAllByLabelText(`${defaultQuestionnaireName}-CaseID`);
      const outcomeRows = view.getAllByLabelText(`${defaultQuestionnaireName}-Outcome`);
      const interviewerRows = view.getAllByLabelText(`${defaultQuestionnaireName}-Interviewer`);
      const organisationRows = view.getAllByLabelText(`${defaultQuestionnaireName}-Organisation`);
      const linksRows = view.getAllByLabelText(`${defaultQuestionnaireName}-Links`);

      mockCaseList.forEach((caseDetails, index) => {
        expect(caseIdRows[index]).toHaveTextContent(caseDetails.primaryKey);
        expect(outcomeRows[index]).toHaveTextContent(caseDetails.outcome.toString());
        expect(interviewerRows[index]).toHaveTextContent(caseDetails.interviewer);
        expect(organisationRows[index]).toHaveTextContent(String(caseDetails.organisation));
        expect(linksRows[index]).toHaveTextContent("Edit interviewer case | View interviewer case");
      });
    });
  });
});

describe("Given there are no surveys available in blaise", () => {
  beforeEach(() => {
    mockGetSurveys.mockImplementation(() => Promise.resolve([]));
  });

  afterEach(() => {
    mockGetSurveys.mockReset();
  });

  it("should render the page correctly when no surveys are returned", async () => {
    const user = makeUser();

    await act(async () => {
      view = render(
        <BrowserRouter>
          <SupportHome user={user} />
        </BrowserRouter>,
      );
    });

    expect(view).toMatchSnapshot("SupportPageNoSurveysReturned");
  });

  it("should display a message telling the user there are no surveys", async () => {
    const user = makeUser();

    await act(async () => {
      view = render(
        <BrowserRouter>
          <SupportHome user={user} />
        </BrowserRouter>,
      );
    });

    const surveysView = view.getByTestId("Surveys");

    expect(surveysView).toHaveTextContent("There are no surveys available");
  });
});

describe("Given there the blaise rest api is not available", () => {
  beforeEach(() => {
    mockGetSurveys.mockRejectedValue(new Error("try again in a few minutes"));
  });

  afterEach(() => {
    mockGetSurveys.mockReset();
  });

  it("should display an error message telling the user to try again in a few minutes", async () => {
    const user = makeUser();

    await act(async () => {
      view = render(
        <BrowserRouter>
          <SupportHome user={user} />
        </BrowserRouter>,
      );
    });

    const surveysView = view.getByTestId("Surveys");

    expect(surveysView).toHaveTextContent("try again in a few minutes");
  });

  it("should render the page correctly for the user when an error occurs", async () => {
    const user = makeUser();

    await act(async () => {
      view = render(
        <BrowserRouter>
          <SupportHome user={user} />
        </BrowserRouter>,
      );
    });

    expect(view).toMatchSnapshot("SupportPageError");
  });
});

describe("Given there is an error that triggered a catch all 404 or 500 response", () => {
  beforeEach(() => {
    Object.defineProperty(window, "location", {
      value: {
        ...window.location,
        search: "?error=Something%20went%20wrong",
      },
      writable: true,
    });
  });

  it("an error message will be displayed with the parameters contents", async () => {
    const user = makeUser();

    render(<SupportHome user={user} />);

    expect(await screen.findByTestId("ErrorMessage")).toHaveTextContent("Something went wrong");
  });
});
