import { act, fireEvent, render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { getAllocationDetails, updateAllocationDetails } from "../../api/nodeApi";
import mockAllocation from "../../test-utils/allocation.mock";
import UserRole from "../../types/user.types";

import Allocate from "./allocate";

import type { RenderResult } from "@testing-library/react";

const supervisorRole: UserRole = UserRole.SVT_Supervisor;
const editorRole: UserRole = UserRole.SVT_Editor;
let view: RenderResult;

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useParams: vi.fn().mockReturnValue({ questionnaireName: "FRS2504A", caseId: "10001011" }),
}));

vi.mock("../../api/nodeApi");
const mockGetAllocationDetails = vi.mocked(getAllocationDetails);
const mockUpdateAllocationDetails = vi.mocked(updateAllocationDetails);

describe("Given we wish to allocte cases from an Interviewer to an Editor", () => {
  const reallocate = false;

  beforeEach(() => {
    mockGetAllocationDetails.mockReturnValue(Promise.resolve(mockAllocation));
    mockUpdateAllocationDetails.mockResolvedValue();
  });

  afterEach(() => {
    mockGetAllocationDetails.mockReset();
    mockUpdateAllocationDetails.mockReset();
  });

  it("should render the allocation page correctly", async () => {
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate
            supervisorRole={supervisorRole}
            editorRole={editorRole}
            reallocate={reallocate}
          />
        </BrowserRouter>,
      );
    });

    expect(view).toMatchSnapshot("AllocationPage");
  });

  it("should display an have the correct page info for allocation", async () => {
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate
            supervisorRole={supervisorRole}
            editorRole={editorRole}
            reallocate={reallocate}
          />
        </BrowserRouter>,
      );
    });

    const panelView = view.getByTestId("allocation-page-panel-panel");

    expect(panelView).toHaveTextContent(
      "Allocate cases from an interviewer to an editor. All cases conducted by that interviewer will be allocated to the editor",
    );
  });

  it("should display alist of availiable interviewer for alloction from", async () => {
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate
            supervisorRole={supervisorRole}
            editorRole={editorRole}
            reallocate={reallocate}
          />
        </BrowserRouter>,
      );
    });

    const interviewerListOption = view.getByTestId("select-from-input");

    expect(interviewerListOption.childElementCount).toEqual(mockAllocation.Interviewers.length + 1);

    expect(interviewerListOption.children[0]).toHaveTextContent("Select an option");
    mockAllocation.Interviewers.forEach((interviewer, interviewerIndex) => {
      expect(interviewerListOption.children[interviewerIndex + 1]).toHaveTextContent(
        `${interviewer.Name} (${interviewer.Cases.length} case(s))`,
      );
    });
  });

  it("should display alist of availiable editors for alloction to", async () => {
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate
            supervisorRole={supervisorRole}
            editorRole={editorRole}
            reallocate={reallocate}
          />
        </BrowserRouter>,
      );
    });

    const editorListOption = view.getByTestId("select-to-input");

    expect(editorListOption.childElementCount).toEqual(mockAllocation.Editors.length + 1);

    expect(editorListOption.children[0]).toHaveTextContent("Select an option");
    mockAllocation.Editors.forEach((editor, editorIndex) => {
      expect(editorListOption.children[editorIndex + 1]).toHaveTextContent(
        `${editor.Name} (${editor.Cases.length} case(s))`,
      );
    });
  });

  it("should call updateAllocationDetails with the expected parameters when the allocation button is clicked", async () => {
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate
            supervisorRole={supervisorRole}
            editorRole={editorRole}
            reallocate={reallocate}
          />
        </BrowserRouter>,
      );
    });

    await act(async () => {
      fireEvent.change(view.getByTestId("select-from-input"), { target: { value: "jamester" } });
      fireEvent.change(view.getByTestId("select-to-input"), { target: { value: "Jake" } });
      fireEvent.click(view.getByText("Allocate"));
    });

    expect(mockUpdateAllocationDetails).toBeCalledWith("FRS2504A", "Jake", ["10001013"]);
  });

  it("should call updateAllocationDetails with the expected parameters when the allocation button is clicked is clicked and number of cases is limited to 1", async () => {
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate
            supervisorRole={supervisorRole}
            editorRole={editorRole}
            reallocate={reallocate}
          />
        </BrowserRouter>,
      );
    });

    await act(async () => {
      fireEvent.change(view.getByTestId("select-from-input"), { target: { value: "bob" } });
      fireEvent.change(view.getByTestId("select-to-input"), { target: { value: "Jake" } });
      fireEvent.change(view.getByTestId("number-of-cases-input"), { target: { value: "1" } });
      fireEvent.click(view.getByText("Allocate"));
    });

    expect(mockUpdateAllocationDetails).toBeCalledWith("FRS2504A", "Jake", ["10001011"]);
  });

  it("should show a success message when allocation is successful", async () => {
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate
            supervisorRole={supervisorRole}
            editorRole={editorRole}
            reallocate={reallocate}
          />
        </BrowserRouter>,
      );
    });

    await act(async () => {
      fireEvent.change(view.getByTestId("select-from-input"), { target: { value: "jamester" } });
      fireEvent.change(view.getByTestId("select-to-input"), { target: { value: "Jake" } });
      fireEvent.click(view.getByText("Allocate"));
    });

    const successMessage = view.getByTestId("SuccessMessage");

    expect(successMessage).toHaveTextContent(
      "Case(s) '10001013' have been allocated to 'Jake' for 'FRS2504A'",
    );

    expect(view.queryByTestId("ErrorMessage")).not.toBeInTheDocument();
  });

  it("should show an error message when allocation is not successful", async () => {
    mockUpdateAllocationDetails.mockRejectedValue(new Error("Could not allocate cases"));

    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate
            supervisorRole={supervisorRole}
            editorRole={editorRole}
            reallocate={reallocate}
          />
        </BrowserRouter>,
      );
    });

    await act(async () => {
      fireEvent.change(view.getByTestId("select-from-input"), { target: { value: "jamester" } });
      fireEvent.change(view.getByTestId("select-to-input"), { target: { value: "Jake" } });
      fireEvent.click(view.getByText("Allocate"));
    });

    const errorMessage = view.getByTestId("ErrorMessage");

    expect(errorMessage).toHaveTextContent(
      "Case(s) could not be allocated, please try again in a few seconds",
    );

    expect(view.queryByTestId("SuccessMessage")).not.toBeInTheDocument();
  });
});

describe("Given we wish to reallocte cases from an Editor to another Editor", () => {
  const reallocate = true;

  beforeEach(() => {
    mockGetAllocationDetails.mockReturnValue(Promise.resolve(mockAllocation));
    mockUpdateAllocationDetails.mockResolvedValue();
  });

  afterEach(() => {
    mockGetAllocationDetails.mockReset();
    mockUpdateAllocationDetails.mockReset();
  });

  it("should render the allocation page correctly", async () => {
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate
            supervisorRole={supervisorRole}
            editorRole={editorRole}
            reallocate={reallocate}
          />
        </BrowserRouter>,
      );
    });

    expect(view).toMatchSnapshot("ReallocationPage");
  });

  it("should display an have the correct page info for reallocation", async () => {
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate
            supervisorRole={supervisorRole}
            editorRole={editorRole}
            reallocate={reallocate}
          />
        </BrowserRouter>,
      );
    });

    const panelView = view.getByTestId("allocation-page-panel-panel");

    expect(panelView).toHaveTextContent(
      "Reallocate cases from one editor to another editor. All non-completed cases will be transferred",
    );
  });

  it("should display a list of editors for realloction from", async () => {
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate
            supervisorRole={supervisorRole}
            editorRole={editorRole}
            reallocate={reallocate}
          />
        </BrowserRouter>,
      );
    });

    const editorListOption = view.getByTestId("select-from-input");

    expect(editorListOption.childElementCount).toEqual(mockAllocation.Editors.length + 1);

    expect(editorListOption.children[0]).toHaveTextContent("Select an option");
    mockAllocation.Editors.forEach((editor, editorIndex) => {
      expect(editorListOption.children[editorIndex + 1]).toHaveTextContent(
        `${editor.Name} (${editor.Cases.length} case(s))`,
      );
    });
  });

  it("should display a list of availiable editors for realloction to", async () => {
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate
            supervisorRole={supervisorRole}
            editorRole={editorRole}
            reallocate={reallocate}
          />
        </BrowserRouter>,
      );
    });

    const editorListOption = view.getByTestId("select-to-input");

    expect(editorListOption.childElementCount).toEqual(mockAllocation.Editors.length + 1);

    expect(editorListOption.children[0]).toHaveTextContent("Select an option");
    mockAllocation.Editors.forEach((editor, editorIndex) => {
      expect(editorListOption.children[editorIndex + 1]).toHaveTextContent(
        `${editor.Name} (${editor.Cases.length} case(s))`,
      );
    });
  });

  it("should call updateAllocationDetails with the expected parameters when the allocation button is clicked", async () => {
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate
            supervisorRole={supervisorRole}
            editorRole={editorRole}
            reallocate={reallocate}
          />
        </BrowserRouter>,
      );
    });

    await act(async () => {
      fireEvent.change(view.getByTestId("select-from-input"), { target: { value: "Jake" } });
      fireEvent.change(view.getByTestId("select-to-input"), { target: { value: "Rich" } });
      fireEvent.click(view.getByText("Reallocate"));
    });

    expect(mockUpdateAllocationDetails).toBeCalledWith("FRS2504A", "Rich", [
      "10001012",
      "10001015",
    ]);
  });

  it("should call updateAllocationDetails with the expected parameters when the allocation button is clicked and number of cases is limited to 1", async () => {
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate
            supervisorRole={supervisorRole}
            editorRole={editorRole}
            reallocate={reallocate}
          />
        </BrowserRouter>,
      );
    });

    await act(async () => {
      fireEvent.change(view.getByTestId("select-from-input"), { target: { value: "Jake" } });
      fireEvent.change(view.getByTestId("select-to-input"), { target: { value: "Rich" } });
      fireEvent.change(view.getByTestId("number-of-cases-input"), { target: { value: "1" } });
      fireEvent.click(view.getByText("Reallocate"));
    });

    expect(mockUpdateAllocationDetails).toBeCalledWith("FRS2504A", "Rich", ["10001012"]);
  });

  it("should show a success message when reallocation is successful", async () => {
    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate
            supervisorRole={supervisorRole}
            editorRole={editorRole}
            reallocate={reallocate}
          />
        </BrowserRouter>,
      );
    });

    await act(async () => {
      fireEvent.change(view.getByTestId("select-from-input"), { target: { value: "Jake" } });
      fireEvent.change(view.getByTestId("select-to-input"), { target: { value: "Rich" } });
      fireEvent.click(view.getByText("Reallocate"));
    });

    const successMessage = view.getByTestId("SuccessMessage");

    expect(successMessage).toHaveTextContent(
      "Case(s) '10001012, 10001015' have been allocated to 'Rich' for 'FRS2504A'",
    );

    expect(view.queryByTestId("ErrorMessage")).not.toBeInTheDocument();
  });

  it("should show an error message when allocation is not successful", async () => {
    mockUpdateAllocationDetails.mockRejectedValue(new Error("Could not allocate cases"));

    await act(async () => {
      view = render(
        <BrowserRouter>
          <Allocate
            supervisorRole={supervisorRole}
            editorRole={editorRole}
            reallocate={reallocate}
          />
        </BrowserRouter>,
      );
    });

    await act(async () => {
      fireEvent.change(view.getByTestId("select-from-input"), { target: { value: "Jake" } });
      fireEvent.change(view.getByTestId("select-to-input"), { target: { value: "Rich" } });
      fireEvent.click(view.getByText("Reallocate"));
    });

    const errorMessage = view.getByTestId("ErrorMessage");

    expect(errorMessage).toHaveTextContent(
      "Case(s) could not be allocated, please try again in a few seconds",
    );

    expect(view.queryByTestId("SuccessMessage")).not.toBeInTheDocument();
  });
});
