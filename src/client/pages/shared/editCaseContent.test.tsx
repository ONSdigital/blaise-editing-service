import { act, fireEvent, render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { mockCaseAllocatedToRich } from "../../../server/test-utils/case.mock";
import { getSpecificCaseEditInformation, setCaseToUpdate } from "../../api/nodeApi";
import UserRole from "../../types/user.types";

import EditCaseContent from "./editCaseContent";

import type { RenderResult } from "@testing-library/react";

const supervisorRole: UserRole = UserRole.SVT_Supervisor;
const researcherRole: UserRole = UserRole.FRS_Researcher;
const supportRole: UserRole = UserRole.Survey_Support;
let view: RenderResult;

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useParams: vi.fn().mockReturnValue({ questionnaireName: "FRS2504A", caseId: "10001011" }),
}));

vi.mock("../../api/nodeApi");
const mockGetSpecificCaseEditInformation = vi.mocked(getSpecificCaseEditInformation);
const mockSetCaseToUpdate = vi.mocked(setCaseToUpdate);

describe("Given we want to view the Edit Case page of a case", () => {
  beforeEach(() => {
    mockGetSpecificCaseEditInformation.mockReturnValue(Promise.resolve(mockCaseAllocatedToRich));
  });

  afterEach(() => {
    mockGetSpecificCaseEditInformation.mockReset();
    mockSetCaseToUpdate.mockReset();
  });

  it("should render the Editing page correctly for a Supervisor user", async () => {
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditCaseContent role={supervisorRole} />
        </BrowserRouter>,
      );
    });

    expect(view).toMatchSnapshot("EditCaseContentSupervisor");
  });

  it("should display correct case details in a table format for a Supervisor user", async () => {
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditCaseContent role={supervisorRole} />
        </BrowserRouter>,
      );
    });

    const caseDetailsTable = view.getByTestId(
      `${mockCaseAllocatedToRich.primaryKey}-case-details-table`,
    );
    const editCaseLink = view.getByTestId("edit-case-link");

    expect(caseDetailsTable).toHaveTextContent(mockCaseAllocatedToRich.primaryKey);
    expect(caseDetailsTable).toHaveTextContent(`${mockCaseAllocatedToRich.outcome}`);
    expect(caseDetailsTable).toHaveTextContent(`${mockCaseAllocatedToRich.interviewer}`);
    expect(caseDetailsTable).toHaveTextContent(`${mockCaseAllocatedToRich.organisation}`);
    expect(editCaseLink).toHaveTextContent("Edit Case");
    expect(editCaseLink).toHaveAttribute("href", `${mockCaseAllocatedToRich.editUrl}`);
  });

  it("should not display Update case button in Edit Case Form for a Supervisor user", async () => {
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditCaseContent role={supervisorRole} />
        </BrowserRouter>,
      );
    });

    const updateCaseButton = view.queryByTestId("button");

    expect(updateCaseButton).toBeNull();
  });

  it("should render the Editing page correctly for a Research user", async () => {
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditCaseContent role={researcherRole} />
        </BrowserRouter>,
      );
    });

    expect(view).toMatchSnapshot("EditCaseContentResearch");
  });

  it("should display correct case details in a table format for a Research user", async () => {
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditCaseContent role={researcherRole} />
        </BrowserRouter>,
      );
    });

    const caseDetailsTable = view.getByTestId(
      `${mockCaseAllocatedToRich.primaryKey}-case-details-table`,
    );
    const editCaseLink = view.getByTestId("edit-case-link");

    expect(caseDetailsTable).toHaveTextContent(mockCaseAllocatedToRich.primaryKey);
    expect(caseDetailsTable).toHaveTextContent(`${mockCaseAllocatedToRich.outcome}`);
    expect(caseDetailsTable).toHaveTextContent(`${mockCaseAllocatedToRich.interviewer}`);
    expect(caseDetailsTable).toHaveTextContent(`${mockCaseAllocatedToRich.organisation}`);
    expect(editCaseLink).toHaveTextContent("Edit Case");
    expect(editCaseLink).toHaveAttribute("href", `${mockCaseAllocatedToRich.editUrl}`);
  });

  it("should not display Update case button in Edit Case Form for a Research user", async () => {
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditCaseContent role={researcherRole} />
        </BrowserRouter>,
      );
    });

    const updateCaseButton = view.queryByTestId("button");

    expect(updateCaseButton).toBeNull();
  });

  it("should render the Editing page correctly for a Survey Support user", async () => {
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditCaseContent role={supportRole} />
        </BrowserRouter>,
      );
    });

    expect(view).toMatchSnapshot("EditCaseContentSupport");
  });

  it("should display correct case details in a table format for a Survey Support user", async () => {
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditCaseContent role={supportRole} />
        </BrowserRouter>,
      );
    });

    const caseDetailsTable = view.getByTestId(
      `${mockCaseAllocatedToRich.primaryKey}-case-details-table`,
    );
    const editCaseLink = view.getByTestId("edit-case-link");

    expect(caseDetailsTable).toHaveTextContent(mockCaseAllocatedToRich.primaryKey);
    expect(caseDetailsTable).toHaveTextContent(`${mockCaseAllocatedToRich.outcome}`);
    expect(caseDetailsTable).toHaveTextContent(`${mockCaseAllocatedToRich.interviewer}`);
    expect(caseDetailsTable).toHaveTextContent(`${mockCaseAllocatedToRich.organisation}`);
    expect(editCaseLink).toHaveTextContent("Edit interviewer Case");
    expect(editCaseLink).toHaveAttribute("href", `${mockCaseAllocatedToRich.editUrl}`);
  });

  it("should display Update case button in Edit Case Form for a Survey Support user", async () => {
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditCaseContent role={supportRole} />
        </BrowserRouter>,
      );
    });

    const updateCaseButton = view.getByRole("button", { name: "Update case" });

    expect(updateCaseButton).toHaveTextContent("Update case");
  });

  it("should display success message when clicking Update case button successfully for a Survey Support user", async () => {
    mockSetCaseToUpdate.mockReturnValue(Promise.resolve(204));
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditCaseContent role={supportRole} />
        </BrowserRouter>,
      );
    });

    const updateCaseButton = view.getByRole("button", { name: "Update case" });

    await act(async () => {
      fireEvent.click(updateCaseButton);
    });

    const successMessage = view.getByTestId("SuccessMessage");

    expect(successMessage).toHaveTextContent(
      `Successfully set case with ID, ${mockCaseAllocatedToRich.primaryKey}, to update editing database overnight`,
    );
    expect(view.queryByTestId("ErrorMessage")).not.toBeInTheDocument();
  });

  it("should display Error message when clicking Update case button fails with a 404 for a Survey Support user", async () => {
    mockSetCaseToUpdate.mockReturnValue(Promise.resolve(404));
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditCaseContent role={supportRole} />
        </BrowserRouter>,
      );
    });

    const updateCaseButton = view.getByRole("button", { name: "Update case" });

    await act(async () => {
      fireEvent.click(updateCaseButton);
    });

    const errorMessage = view.getByTestId("ErrorMessage");

    expect(errorMessage).toHaveTextContent(
      `Failed to set case with ID, ${mockCaseAllocatedToRich.primaryKey}, to update, please try again in a few seconds or contact service desk to raise a support ticket`,
    );
    expect(view.queryByTestId("SuccessMessage")).not.toBeInTheDocument();
  });

  it("should display Error message when clicking Update case button fails with a 500 for a Survey Support user", async () => {
    mockSetCaseToUpdate.mockReturnValue(Promise.resolve(500));
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditCaseContent role={supportRole} />
        </BrowserRouter>,
      );
    });

    const updateCaseButton = view.getByRole("button", { name: "Update case" });

    await act(async () => {
      fireEvent.click(updateCaseButton);
    });

    const errorMessage = view.getByTestId("ErrorMessage");

    expect(errorMessage).toHaveTextContent(
      `Failed to set case with ID, ${mockCaseAllocatedToRich.primaryKey}, to update, please try again in a few seconds or contact service desk to raise a support ticket`,
    );
    expect(view.queryByTestId("SuccessMessage")).not.toBeInTheDocument();
  });

  it("should display Error message when clicking Update case button throws an error for a Survey Support user", async () => {
    mockSetCaseToUpdate.mockRejectedValue(new Error("Could not Update case"));
    await act(async () => {
      view = render(
        <BrowserRouter>
          <EditCaseContent role={supportRole} />
        </BrowserRouter>,
      );
    });

    const updateCaseButton = view.getByRole("button", { name: "Update case" });

    await act(async () => {
      fireEvent.click(updateCaseButton);
    });

    const errorMessage = view.getByTestId("ErrorMessage");

    expect(errorMessage).toHaveTextContent(
      `Failed to set case with ID, ${mockCaseAllocatedToRich.primaryKey}, to update, please try again in a few seconds or contact service desk to raise a support ticket`,
    );
    expect(view.queryByTestId("SuccessMessage")).not.toBeInTheDocument();
  });
});
