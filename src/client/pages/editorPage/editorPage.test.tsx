import { act, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import mockUser from "../../../server/test-utils/user.mock";
import { getEditorInformation, getSurveys } from "../../api/nodeApi";
import {
  mockEditorWithFiveAllocatedCases,
  mockEditorWithFourAllocatedCases,
} from "../../test-utils/editor.mock";
import mockFilteredSurveyList from "../../test-utils/survey.mock";
import UserRole from "../../types/user.types";

import EditorHome from "./editorPage";

import type { RenderResult } from "@testing-library/react";
import type { User } from "blaise-api-node-client";

const userRole: string = UserRole.SVT_Editor;
let view: RenderResult;
const makeUser = (): User => ({ ...mockUser, role: userRole });

vi.mock("../../api/nodeApi", async () => {
  const actual = await vi.importActual("../../api/nodeApi");

  return {
    ...actual,
    getSurveys: vi.fn(() => Promise.resolve([])),
    getEditorInformation: vi.fn(() => Promise.resolve({})),
  };
});
const mockGetSurveys = vi.mocked(getSurveys);
const mockGetEditorInformation = vi.mocked(getEditorInformation);

describe("Given there are surveys available in blaise", () => {
  beforeEach(() => {
    mockGetSurveys.mockImplementation(() => Promise.resolve(mockFilteredSurveyList));
    mockGetEditorInformation
      .mockReturnValueOnce(Promise.resolve(mockEditorWithFiveAllocatedCases))
      .mockReturnValueOnce(Promise.resolve(mockEditorWithFourAllocatedCases));
  });

  afterEach(() => {
    mockGetSurveys.mockReset();
    mockGetEditorInformation.mockReset();
  });

  it("should render the editor page correctly when surveys are returned", async () => {
    const user = makeUser();

    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditorHome user={user} />
        </BrowserRouter>,
      );
    });

    expect(view).toMatchSnapshot("EditPageSurveysReturned");
  });

  it("should display a list of the expected surveys", async () => {
    const user = makeUser();

    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditorHome user={user} />
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

      expect(questionnaireListView).toHaveTextContent(
        defaultQuestionnaire.questionnaireName.replace("_EDIT", ""),
      );

      const questionnaireView = view.getByTestId(
        `${defaultQuestionnaire.questionnaireName}-editorContent`,
      );

      expect(questionnaireView).toHaveTextContent("Filter cases");

      const caseRows = view.getAllByLabelText(`${defaultQuestionnaire.questionnaireName}-CaseID`);
      const editStatusRows = view.getAllByLabelText(
        `${defaultQuestionnaire.questionnaireName}-EditStatus`,
      );

      mockEditorWithFiveAllocatedCases.Cases.forEach((caseDetails, caseIndex) => {
        expect(caseRows[caseIndex]).toHaveTextContent(caseDetails.CaseId);
        expect(editStatusRows[caseIndex]).toHaveTextContent(String(caseDetails.EditStatus));
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
          <EditorHome user={user} />
        </BrowserRouter>,
      );
    });

    expect(view).toMatchSnapshot("EditPageNoSurveysReturned");
  });

  it("should display a message telling the user there are no surveys", async () => {
    const user = makeUser();

    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditorHome user={user} />
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
          <EditorHome user={user} />
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
          <EditorHome user={user} />
        </BrowserRouter>,
      );
    });

    expect(view).toMatchSnapshot("EditorPageError");
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

    render(<EditorHome user={user} />);

    expect(await screen.findByTestId("ErrorMessage")).toHaveTextContent("Something went wrong");
  });
});
