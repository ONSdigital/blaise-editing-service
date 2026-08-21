import { mockCaseSummaryDetails } from "../../server/test-utils/case.mock";

import toCaseSummaryText from "./caseSummaryTextMapper";

import type { CaseSummaryDetails } from "../../common/types/case.types";

describe("mapCaseSummaryText", () => {
  it("maps a case summary into a summary-style text payload", () => {
    const output = toCaseSummaryText(mockCaseSummaryDetails);

    expect(output).toContain("Interview details");
    expect(output).toContain("Relationship grid");
    expect(output).toContain("Household details");
    expect(output.indexOf("Relationship grid")).toBeGreaterThan(
      output.indexOf("Household details"),
    );
    expect(output).toMatch(new RegExp(`Serial number:\\s+${mockCaseSummaryDetails.CaseId}`));
    expect(output).toMatch(new RegExp(`Outcome code:\\s+${mockCaseSummaryDetails.OutcomeCode}`));
    expect(output).toMatch(
      new RegExp(`Interview date:\\s+${mockCaseSummaryDetails.InterviewDate?.toDateString()}`),
    );
    expect(output).toContain("Accommodation type:           Main: House/Bungalow, Type: Detached");
    expect(output).toMatch(/Receipt of housing benefit:\s+Amount: 380, Period: One week/);
    expect(output).toMatch(/Business room:\s+Yes/);
    expect(output).toMatch(/Self employed:\s+Yes - H\/H members: 1, 2/);
    expect(output).toMatch(/Income support:\s+Yes - H\/H members: 1/);
    expect(output).toMatch(/Income based JA support:\s+Yes - H\/H members: 1/);
    expect(output).toContain("Richmond Ricecake");
    expect(output).toContain("Betty Bettison");
    expect(output).not.toContain("Fact Sheet");
  });

  it("handles missing interview date, repeated housing benefit lines, and false booleans", () => {
    const caseSummaryWithNoFlags = {
      ...mockCaseSummaryDetails,
      InterviewDate: undefined,
      Household: {
        ...mockCaseSummaryDetails.Household,
        BusinessRoom: false,
        SelfEmployed: false,
        SelfEmployedMembers: [],
        IncomeSupport: false,
        IncomeSupportMembers: [],
        IncomeBasedJaSupport: false,
        IncomeBasedJaSupportMembers: [],
        ReceiptOfHousingBenefit: [
          {
            Amount: "100",
            PeriodCode: "Four weeks",
          },
          {
            Amount: "200",
            PeriodCode: "Calendar month",
          },
        ],
      },
    } as unknown as CaseSummaryDetails;

    const output = toCaseSummaryText(caseSummaryWithNoFlags);

    expect(output).toMatch(/Interview date:\s+N\/A/);
    expect(output).toMatch(/Receipt of housing benefit:\s+Amount: 100, Period: Four weeks/);
    expect(output).toMatch(/\n\s+Amount: 200, Period: Calendar month/);
    expect(output).toMatch(/Business room:\s+No/);
    expect(output).toMatch(/Self employed:\s+No/);
    expect(output).toMatch(/Income support:\s+No/);
    expect(output).toMatch(/Income based JA support:\s+No/);
  });
});
