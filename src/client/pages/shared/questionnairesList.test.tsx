import { fireEvent, render, screen } from "@testing-library/react";

import {
  frsQuestionnaireDetailsMock1,
  frsQuestionnaireDetailsMock2,
} from "../../../server/test-utils/questionnaireList.mock";
import mockUser from "../../../server/test-utils/user.mock";
import UserRole from "../../types/user.types";

import QuestionnairesList from "./questionnairesList";

import type { User } from "blaise-api-node-client";

vi.mock("../supervisorPage/sections/supervisorQuestionnaireDetails", () => ({
  default: ({ questionnaire }: { questionnaire: { questionnaireName: string } }) => (
    <div data-testid="supervisor-details">{questionnaire.questionnaireName}</div>
  ),
}));

vi.mock("../editorPage/sections/editorQuestionnaireDetails", () => ({
  default: ({
    questionnaire,
    username,
  }: {
    questionnaire: { questionnaireName: string };
    username: string;
  }) => <div data-testid="editor-details">{`${questionnaire.questionnaireName}:${username}`}</div>,
}));

vi.mock("../researchPage/sections/researchQuestionnaireDetails", () => ({
  default: ({ questionnaire }: { questionnaire: { questionnaireName: string } }) => (
    <div data-testid="research-details">{questionnaire.questionnaireName}</div>
  ),
}));

vi.mock("../supportPage/sections/supportQuestionnaireDetails", () => ({
  default: ({ questionnaire }: { questionnaire: { questionnaireName: string } }) => (
    <div data-testid="support-details">{questionnaire.questionnaireName}</div>
  ),
}));

const questionnaires = [frsQuestionnaireDetailsMock1, frsQuestionnaireDetailsMock2];

const makeUser = (role: User["role"]): User => ({ ...mockUser, role });

describe("QuestionnairesList", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("selects the first questionnaire when there is no saved questionnaire", () => {
    render(
      <QuestionnairesList
        questionnaires={questionnaires}
        user={makeUser(UserRole.SVT_Supervisor)}
      />,
    );

    expect(screen.getByTestId("select-questionnaire-input")).toHaveValue(
      frsQuestionnaireDetailsMock1.questionnaireName,
    );
    expect(screen.getByTestId("supervisor-details")).toHaveTextContent(
      frsQuestionnaireDetailsMock1.questionnaireName,
    );
    expect(screen.getByRole("option", { name: "FRS2408B (August 2024)" })).toBeInTheDocument();
  });

  it("uses a saved questionnaire when it is present in the available options", () => {
    localStorage.setItem(
      "savedQuestionnaireOption",
      frsQuestionnaireDetailsMock2.questionnaireName,
    );

    render(
      <QuestionnairesList
        questionnaires={questionnaires}
        user={makeUser(UserRole.SVT_Supervisor)}
      />,
    );

    expect(screen.getByTestId("select-questionnaire-input")).toHaveValue(
      frsQuestionnaireDetailsMock2.questionnaireName,
    );
    expect(screen.getByTestId("supervisor-details")).toHaveTextContent(
      frsQuestionnaireDetailsMock2.questionnaireName,
    );
  });

  it("falls back to the first questionnaire when the saved questionnaire is no longer available", () => {
    localStorage.setItem("savedQuestionnaireOption", "MISSING_QUESTIONNAIRE");

    render(
      <QuestionnairesList
        questionnaires={questionnaires}
        user={makeUser(UserRole.SVT_Supervisor)}
      />,
    );

    expect(screen.getByTestId("select-questionnaire-input")).toHaveValue(
      frsQuestionnaireDetailsMock1.questionnaireName,
    );
    expect(screen.getByTestId("supervisor-details")).toHaveTextContent(
      frsQuestionnaireDetailsMock1.questionnaireName,
    );
  });

  it("updates the questionnaire selection and persists the selected value", () => {
    render(
      <QuestionnairesList
        questionnaires={questionnaires}
        user={makeUser(UserRole.SVT_Supervisor)}
      />,
    );

    const select = screen.getByTestId("select-questionnaire-input");

    fireEvent.change(select, { target: { value: frsQuestionnaireDetailsMock2.questionnaireName } });

    expect(select).toHaveValue(frsQuestionnaireDetailsMock2.questionnaireName);
    expect(localStorage.getItem("savedQuestionnaireOption")).toBe(
      frsQuestionnaireDetailsMock2.questionnaireName,
    );
    expect(screen.getByTestId("supervisor-details")).toHaveTextContent(
      frsQuestionnaireDetailsMock2.questionnaireName,
    );
  });

  it("renders editor details for editor users", () => {
    render(
      <QuestionnairesList
        questionnaires={[frsQuestionnaireDetailsMock1]}
        user={makeUser(UserRole.SVT_Editor)}
      />,
    );

    expect(screen.getByTestId("editor-details")).toHaveTextContent(
      `${frsQuestionnaireDetailsMock1.questionnaireName}:${mockUser.name}`,
    );
  });

  it.each([
    { role: UserRole.FRS_Researcher, testId: "research-details" },
    { role: UserRole.Survey_Support, testId: "support-details" },
  ])("renders the expected details component for $role users", ({ role, testId }) => {
    render(
      <QuestionnairesList
        questionnaires={[frsQuestionnaireDetailsMock1]}
        user={makeUser(role)}
      />,
    );

    expect(screen.getByTestId(testId)).toHaveTextContent(
      frsQuestionnaireDetailsMock1.questionnaireName,
    );
  });
});

describe("QuestionnairesList unsupported role", () => {
  it("shows an error panel when the user role is not recognised", () => {
    const user = makeUser("invalid_Role");

    render(
      <QuestionnairesList
        questionnaires={[frsQuestionnaireDetailsMock1]}
        user={user}
      />,
    );

    expect(screen.getByTestId("ErrorMessage")).toHaveTextContent(
      "User role invalid_Role not recognised",
    );
  });
});
