import { render, screen } from "@testing-library/react";

import {
  frsQuestionnaireDetailsMock1,
  mockLmsQuestionnaireDetails,
} from "../../../server/test-utils/questionnaireList.mock";
import mockSurveyList from "../../../server/test-utils/surveyList.mock";
import mockUser from "../../../server/test-utils/user.mock";

import SurveysList from "./surveysList";

import type { QuestionnaireDetails, Survey } from "../../../common/types/survey.types";
import type { User } from "blaise-api-node-client";
import type { ReactNode } from "react";

vi.mock("blaise-design-system-react-components", () => ({
  Panel: ({ children }: { children: ReactNode }) => <div data-testid="info-panel">{children}</div>,
  Collapsible: ({ id, title, children }: { id: string; title: string; children: ReactNode }) => (
    <section data-testid={`collapsible-${id}`}>
      <h2>{title}</h2>
      {children}
    </section>
  ),
}));

vi.mock("./questionnairesList", () => ({
  default: ({ questionnaires, user }: { questionnaires: QuestionnaireDetails[]; user: User }) => (
    <div data-testid={`questionnaires-${questionnaires[0]?.questionnaireName ?? "none"}`}>
      {user.name}
    </div>
  ),
}));

describe("SurveysList", () => {
  it("shows an info panel when no surveys are available", () => {
    render(
      <SurveysList
        surveys={[]}
        user={mockUser}
      />,
    );

    expect(screen.getByTestId("info-panel")).toHaveTextContent("There are no surveys available");
    expect(screen.queryByTestId("survey-accordion")).not.toBeInTheDocument();
  });

  it("renders one collapsible survey section per survey with questionnaire content", () => {
    const surveys: Survey[] = [
      ...mockSurveyList,
      {
        name: "LMS",
        questionnaires: [mockLmsQuestionnaireDetails],
      },
    ];

    render(
      <SurveysList
        surveys={surveys}
        user={mockUser}
      />,
    );

    expect(screen.getByTestId("survey-accordion")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "FRS" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "LMS" })).toBeInTheDocument();
    expect(
      screen.getByTestId(`questionnaires-${frsQuestionnaireDetailsMock1.questionnaireName}`),
    ).toHaveTextContent(mockUser.name);
    expect(
      screen.getByTestId(`questionnaires-${mockLmsQuestionnaireDetails.questionnaireName}`),
    ).toHaveTextContent(mockUser.name);
  });
});
