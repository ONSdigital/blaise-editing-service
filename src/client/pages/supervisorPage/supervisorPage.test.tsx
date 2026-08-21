import { act, fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { mockCaseEmptyList, mockCaseList } from "../../../server/test-utils/case.mock";
import mockUser from "../../../server/test-utils/user.mock";
import {
  getCaseSearchResults,
  getSupervisorEditorInformation,
  getSurveys,
} from "../../api/nodeApi";
import {
  mockSupervisorWithLargeCaseload,
  mockSupervisorWithSmallCaseload,
} from "../../test-utils/supervisor.mock";
import mockFilteredSurveyList from "../../test-utils/survey.mock";
import UserRole from "../../types/user.types";
import CaseSearchForm from "../shared/caseSearchForm";

import SupervisorHome from "./supervisorPage";

import type { RenderResult } from "@testing-library/react";
import type { User } from "blaise-api-node-client";

const userRole: string = UserRole.SVT_Supervisor;
let view: RenderResult;
const makeUser = (): User => ({ ...mockUser, role: userRole });

vi.mock("../../api/nodeApi", async () => {
  const actual = await vi.importActual("../../api/nodeApi");

  return {
    ...actual,
    getSurveys: vi.fn(() => Promise.resolve([])),
    getSupervisorEditorInformation: vi.fn(() => Promise.resolve({})),
    getCaseSearchResults: vi.fn(() => Promise.resolve([])),
  };
});
const mockGetSurveys = vi.mocked(getSurveys);
const mockGetSupervisorCaseInformation = vi.mocked(getSupervisorEditorInformation);
const mockGetCaseInformation = vi.mocked(getCaseSearchResults);

describe("Given there are surveys available in blaise", () => {
  beforeEach(() => {
    mockGetSurveys.mockImplementation(() => Promise.resolve(mockFilteredSurveyList));
    mockGetSupervisorCaseInformation
      .mockReturnValueOnce(Promise.resolve(mockSupervisorWithLargeCaseload))
      .mockReturnValueOnce(Promise.resolve(mockSupervisorWithSmallCaseload));
  });

  afterEach(() => {
    mockGetSurveys.mockReset();
    mockGetSupervisorCaseInformation.mockReset();
  });

  it("should render the supervisor page correctly when surveys are returned", async () => {
    const user = makeUser();

    await act(async () => {
      view = render(
        <BrowserRouter>
          <SupervisorHome user={user} />
        </BrowserRouter>,
      );
    });

    expect(view).toMatchSnapshot("SupervisorPageSurveysReturned");
  });

  it("should display the expected questionnaire details for the default option", async () => {
    const user = makeUser();

    await act(async () => {
      view = render(
        <BrowserRouter>
          <SupervisorHome user={user} />
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

      const questionnaireView = view.getByTestId(`${defaultQuestionnaireName}-supervisor-Content`);

      expect(questionnaireView).not.toHaveTextContent("Field period");

      expect(questionnaireView).toHaveTextContent(
        String(mockSupervisorWithLargeCaseload.TotalNumberOfCases),
      );
      expect(questionnaireView).toHaveTextContent(
        String(mockSupervisorWithLargeCaseload.NumberOfCasesNotAllocated),
      );
      expect(questionnaireView).toHaveTextContent(
        String(mockSupervisorWithLargeCaseload.NumberOfCasesAllocated),
      );
      expect(questionnaireView).toHaveTextContent(
        String(mockSupervisorWithLargeCaseload.NumberOfCasesCompleted),
      );

      const editorRows = view.getAllByLabelText(`${defaultQuestionnaireName}-Editor`);
      const numberOfCasesAllocatedRows = view.getAllByLabelText(
        `${defaultQuestionnaireName}-NumberOfCasesAllocated`,
      );
      const numberOfCasesCompleted = view.getAllByLabelText(
        `${defaultQuestionnaireName}-NumberOfCasesCompleted`,
      );
      const numberOfCasesQueried = view.getAllByLabelText(
        `${defaultQuestionnaireName}-NumberOfCasesQueried`,
      );

      mockSupervisorWithLargeCaseload.EditorInformation.forEach((editor, index) => {
        expect(editorRows[index]).toHaveTextContent(editor.EditorName);
        expect(numberOfCasesAllocatedRows[index]).toHaveTextContent(
          String(editor.NumberOfCasesAllocated),
        );
        expect(numberOfCasesCompleted[index]).toHaveTextContent(
          String(editor.NumberOfCasesCompleted),
        );
        expect(numberOfCasesQueried[index]).toHaveTextContent(String(editor.NumberOfCasesQueried));
      });
    });
  });
});

describe("Given that search is clicked", () => {
  beforeEach(() => {
    mockGetCaseInformation.mockImplementation(() => Promise.resolve(mockCaseList));
  });

  it("should render the search page correctly", async () => {
    const questionnaireName = "FRS2504A";

    await act(async () => {
      view = render(
        <BrowserRouter>
          <CaseSearchForm
            questionnaireName={questionnaireName}
            userRole={UserRole.SVT_Supervisor}
          />
        </BrowserRouter>,
      );
    });

    expect(view).toMatchSnapshot("SupervisorSerachPage");
  });

  it("should render the search page correctly when cases are searched for", async () => {
    const questionnaireName = "FRS2504A";

    await act(async () => {
      view = render(
        <BrowserRouter>
          <CaseSearchForm
            questionnaireName={questionnaireName}
            userRole={UserRole.SVT_Supervisor}
          />
        </BrowserRouter>,
      );
    });

    await act(async () => {
      fireEvent.change(view.getByTestId("caseid-input"), { target: { value: "900" } });
      fireEvent.click(view.getByText("Search"));
    });

    expect(view).toMatchSnapshot("SupervisorSerachPageSearchUSed");
  });

  it("should display the expected case details when cases are searched for", async () => {
    const questionnaireName = "FRS2504A";

    await act(async () => {
      view = render(
        <BrowserRouter>
          <CaseSearchForm
            questionnaireName={questionnaireName}
            userRole={UserRole.SVT_Supervisor}
          />
        </BrowserRouter>,
      );
    });

    await act(async () => {
      fireEvent.change(view.getByTestId("caseid-input"), { target: { value: "900" } });
      fireEvent.click(view.getByText("Search"));
    });

    const caseIdRows = view.getAllByLabelText(`${questionnaireName}-CaseID`);
    const outcomeRows = view.getAllByLabelText(`${questionnaireName}-Outcome`);
    const interviewerRows = view.getAllByLabelText(`${questionnaireName}-Interviewer`);
    const organisationRows = view.getAllByLabelText(`${questionnaireName}-Organisation`);
    const linksRows = view.getAllByLabelText(`${questionnaireName}-Links`);

    mockCaseList.forEach((caseDetails, index) => {
      expect(caseIdRows[index]).toHaveTextContent(caseDetails.primaryKey);
      expect(outcomeRows[index]).toHaveTextContent(caseDetails.outcome.toString());
      expect(interviewerRows[index]).toHaveTextContent(caseDetails.interviewer);
      expect(organisationRows[index]).toHaveTextContent(String(caseDetails.organisation));
      expect(linksRows[index]).toHaveTextContent("Edit case | View case");
    });
  });
});

describe("Given that search is clicked", () => {
  beforeEach(() => {
    mockGetCaseInformation.mockImplementation(() => Promise.resolve(mockCaseEmptyList));
  });

  it("should render the search page correctly", async () => {
    const questionnaireName = "FRS2504A";

    await act(async () => {
      view = render(
        <BrowserRouter>
          <CaseSearchForm
            questionnaireName={questionnaireName}
            userRole={UserRole.SVT_Supervisor}
          />
        </BrowserRouter>,
      );
    });

    expect(view).toMatchSnapshot("SupervisorSearchPageInitial");
  });

  it("should render the search page correctly and Search button enabled after search text entered", async () => {
    const questionnaireName = "FRS2504A";

    await act(async () => {
      view = render(
        <BrowserRouter>
          <CaseSearchForm
            questionnaireName={questionnaireName}
            userRole={UserRole.SVT_Supervisor}
          />
        </BrowserRouter>,
      );
    });

    await act(async () => {
      fireEvent.change(view.getByTestId("caseid-input"), { target: { value: "900" } });
    });

    expect(view).toMatchSnapshot("SupervisorSerachPageSearchTextEntered");
  });

  it("should render the search page correctly when cases are searched for", async () => {
    const questionnaireName = "FRS2504A";

    await act(async () => {
      view = render(
        <BrowserRouter>
          <CaseSearchForm
            questionnaireName={questionnaireName}
            userRole={UserRole.SVT_Supervisor}
          />
        </BrowserRouter>,
      );
    });

    await act(async () => {
      fireEvent.change(view.getByTestId("caseid-input"), { target: { value: "900" } });
      fireEvent.click(view.getByText("Search"));
    });

    expect(view).toMatchSnapshot("SupervisorSerachPageSearchUsed");
  });

  it("should display error message when cases are searched for using a filter that returns no results", async () => {
    const questionnaireName = "FRS2504A";

    await act(async () => {
      view = render(
        <BrowserRouter>
          <CaseSearchForm
            questionnaireName={questionnaireName}
            userRole={UserRole.SVT_Supervisor}
          />
        </BrowserRouter>,
      );
    });

    await act(async () => {
      fireEvent.change(view.getByTestId("caseid-input"), { target: { value: "900" } });
      fireEvent.click(view.getByText("Search"));
    });

    expect(screen.getByText("No results found for this case ID.")).toBeInTheDocument();
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
          <SupervisorHome user={user} />
        </BrowserRouter>,
      );
    });

    expect(view).toMatchSnapshot("SupervisorPageNoSurveysReturned");
  });

  it("should display a message telling the user there are no surveys", async () => {
    const user = makeUser();

    await act(async () => {
      view = render(
        <BrowserRouter>
          <SupervisorHome user={user} />
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
          <SupervisorHome user={user} />
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
          <SupervisorHome user={user} />
        </BrowserRouter>,
      );
    });

    expect(view).toMatchSnapshot("SupervisorPageError");
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

    render(<SupervisorHome user={user} />);

    expect(await screen.findByTestId("ErrorMessage")).toHaveTextContent("Something went wrong");
  });
});
