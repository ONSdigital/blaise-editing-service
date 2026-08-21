import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, vi } from "vitest";

import { mockCaseAllocatedToRich } from "../../../server/test-utils/case.mock";
import { setCaseToUpdate } from "../../api/nodeApi";
import UserRole from "../../types/user.types";

import EditCaseForm from "./editCaseForm";

vi.mock("../../api/nodeApi");
const mockSetCaseToUpdate = vi.mocked(setCaseToUpdate);

describe("EditCaseForm", () => {
  const questionnaireName = "FRS2504A_EDIT";
  const caseId = "10001011";
  const setMessage = vi.fn();
  const supervisorRole = UserRole.SVT_Supervisor;
  const supportRole = UserRole.Survey_Support;

  beforeEach(() => {
    vi.clearAllMocks();
    setMessage.mockClear();
  });

  it("renders case details in table format", () => {
    render(
      <BrowserRouter>
        <EditCaseForm
          caseDetails={mockCaseAllocatedToRich}
          questionnaireName={questionnaireName}
          caseId={caseId}
          role={supervisorRole}
          setMessage={setMessage}
        />
      </BrowserRouter>,
    );

    const caseDetailsTable = document.getElementById(
      `${mockCaseAllocatedToRich.primaryKey}-case-details`,
    );

    expect(caseDetailsTable).toBeInTheDocument();
    expect(screen.getByText(mockCaseAllocatedToRich.primaryKey)).toBeInTheDocument();
    expect(screen.getByText(mockCaseAllocatedToRich.outcome)).toBeInTheDocument();
    expect(screen.getByText(mockCaseAllocatedToRich.interviewer)).toBeInTheDocument();
    expect(screen.getByText(mockCaseAllocatedToRich.organisation)).toBeInTheDocument();
  });

  it("renders edit case link for SVT Supervisor", () => {
    render(
      <BrowserRouter>
        <EditCaseForm
          caseDetails={mockCaseAllocatedToRich}
          questionnaireName={questionnaireName}
          caseId={caseId}
          role={supervisorRole}
          setMessage={setMessage}
        />
      </BrowserRouter>,
    );

    const editLink = screen.getByTestId("edit-case-link");

    expect(editLink).toHaveTextContent("Edit Case");
    expect(editLink).toHaveAttribute("href", mockCaseAllocatedToRich.editUrl);
  });

  it("renders edit interviewer case link for Survey Support role", () => {
    render(
      <BrowserRouter>
        <EditCaseForm
          caseDetails={mockCaseAllocatedToRich}
          questionnaireName={questionnaireName}
          caseId={caseId}
          role={supportRole}
          setMessage={setMessage}
        />
      </BrowserRouter>,
    );

    const editLink = screen.getByTestId("edit-case-link");

    expect(editLink).toHaveTextContent("Edit interviewer Case");
    expect(editLink).toHaveAttribute("href", mockCaseAllocatedToRich.editUrl);
  });

  it("renders info panel with warning about case details", () => {
    render(
      <BrowserRouter>
        <EditCaseForm
          caseDetails={mockCaseAllocatedToRich}
          questionnaireName={questionnaireName}
          caseId={caseId}
          role={supervisorRole}
          setMessage={setMessage}
        />
      </BrowserRouter>,
    );

    expect(
      screen.getByText(
        "Please check that the case details are correct before editing the case, once you have made changes to the case you will not be able to undo them.",
      ),
    ).toBeInTheDocument();
  });

  it("renders Update case button only for Survey Support role", () => {
    const { rerender } = render(
      <BrowserRouter>
        <EditCaseForm
          caseDetails={mockCaseAllocatedToRich}
          questionnaireName={questionnaireName}
          caseId={caseId}
          role={supportRole}
          setMessage={setMessage}
        />
      </BrowserRouter>,
    );

    expect(screen.getByRole("button", { name: "Update case" })).toBeInTheDocument();

    rerender(
      <BrowserRouter>
        <EditCaseForm
          caseDetails={mockCaseAllocatedToRich}
          questionnaireName={questionnaireName}
          caseId={caseId}
          role={supervisorRole}
          setMessage={setMessage}
        />
      </BrowserRouter>,
    );

    expect(screen.queryByRole("button", { name: "Update case" })).not.toBeInTheDocument();
  });

  it("calls setCaseToUpdate when Update case button is clicked", async () => {
    mockSetCaseToUpdate.mockResolvedValue(204);

    render(
      <BrowserRouter>
        <EditCaseForm
          caseDetails={mockCaseAllocatedToRich}
          questionnaireName={questionnaireName}
          caseId={caseId}
          role={supportRole}
          setMessage={setMessage}
        />
      </BrowserRouter>,
    );

    const updateButton = screen.getByRole("button", { name: "Update case" });

    fireEvent.click(updateButton);

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(mockSetCaseToUpdate).toHaveBeenCalledWith(questionnaireName, caseId);
  });

  it("shows success message when case update succeeds", async () => {
    mockSetCaseToUpdate.mockResolvedValue(204);

    render(
      <BrowserRouter>
        <EditCaseForm
          caseDetails={mockCaseAllocatedToRich}
          questionnaireName={questionnaireName}
          caseId={caseId}
          role={supportRole}
          setMessage={setMessage}
        />
      </BrowserRouter>,
    );

    const updateButton = screen.getByRole("button", { name: "Update case" });

    fireEvent.click(updateButton);

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(setMessage).toHaveBeenCalledWith({
      show: true,
      text: expect.stringContaining(
        `Successfully set case with ID, ${mockCaseAllocatedToRich.primaryKey}, to update`,
      ),
      type: "success",
    });
  });

  it("shows error message when case update fails with wrong response code", async () => {
    mockSetCaseToUpdate.mockResolvedValue(500);

    render(
      <BrowserRouter>
        <EditCaseForm
          caseDetails={mockCaseAllocatedToRich}
          questionnaireName={questionnaireName}
          caseId={caseId}
          role={supportRole}
          setMessage={setMessage}
        />
      </BrowserRouter>,
    );

    const updateButton = screen.getByRole("button", { name: "Update case" });

    fireEvent.click(updateButton);

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(setMessage).toHaveBeenCalledWith({
      show: true,
      text: expect.stringContaining(
        `Failed to set case with ID, ${mockCaseAllocatedToRich.primaryKey}, to update`,
      ),
      type: "error",
    });
  });

  it("shows error message when setCaseToUpdate throws exception", async () => {
    mockSetCaseToUpdate.mockRejectedValue(new Error("Network error"));

    render(
      <BrowserRouter>
        <EditCaseForm
          caseDetails={mockCaseAllocatedToRich}
          questionnaireName={questionnaireName}
          caseId={caseId}
          role={supportRole}
          setMessage={setMessage}
        />
      </BrowserRouter>,
    );

    const updateButton = screen.getByRole("button", { name: "Update case" });

    fireEvent.click(updateButton);

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(setMessage).toHaveBeenCalledWith({
      show: true,
      text: expect.stringContaining(
        `Failed to set case with ID, ${mockCaseAllocatedToRich.primaryKey}, to update`,
      ),
      type: "error",
    });
  });

  it("clears previous message before submitting", async () => {
    mockSetCaseToUpdate.mockResolvedValue(204);

    render(
      <BrowserRouter>
        <EditCaseForm
          caseDetails={mockCaseAllocatedToRich}
          questionnaireName={questionnaireName}
          caseId={caseId}
          role={supportRole}
          setMessage={setMessage}
        />
      </BrowserRouter>,
    );

    const updateButton = screen.getByRole("button", { name: "Update case" });

    fireEvent.click(updateButton);

    await new Promise((resolve) => setTimeout(resolve, 50));

    const clearMessageCall = setMessage.mock.calls.find(
      (call) => call[0].show === false && call[0].text === "",
    );

    expect(clearMessageCall).toBeDefined();
  });
});
