import { useState } from "react";

import { getCaseSummary } from "../../api/nodeApi";
import toCaseSummaryText from "../../utils/caseSummaryTextMapper";
import { clientLogger } from "../../utils/logger";

export interface Props {
  caseId: string;
  questionnaireName: string;
  onError?: (message: string) => void;
}

async function exportSummary(caseId: string, questionnaireName: string) {
  const fileName = `case-summary-${caseId}.txt`;

  clientLogger.info(
    `Attempting to prepare summary for caseId: ${caseId}, questionnaireName: ${questionnaireName}`,
  );

  try {
    const caseSummaryDetails = await getCaseSummary(questionnaireName, caseId);
    let fileContent = toCaseSummaryText(caseSummaryDetails);

    fileContent = fileContent.replace(/\r\n?|\n/g, "\r\n");

    const fileBlob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const objectUrl = URL.createObjectURL(fileBlob);
    const link = document.createElement("a");

    link.download = fileName;
    link.href = objectUrl;
    link.style.display = "none";
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);

    clientLogger.info(`Successfully triggered download for case-summary-${caseId}.txt`);
  } catch (error) {
    clientLogger.error(`Failed to export summary for caseId: ${caseId}:`, error);
    throw error;
  }
}

export function DownloadCaseSummaryLink({ caseId, questionnaireName, onError }: Props) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleExport = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      await exportSummary(caseId, questionnaireName);
    } catch {
      onError?.(
        "Failed to download case summary. Please try again later or contact support for assistance.",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <a
      href={`/questionnaires/${questionnaireName}/cases/${caseId}/summary`}
      id={`download-${caseId}-summary`}
      onClick={(event) => {
        event.preventDefault();

        if (!isDownloading) {
          void handleExport();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();

          if (!isDownloading) {
            void handleExport();
          }
        }
      }}
      aria-label="Download case summary"
      aria-disabled={isDownloading}
    >
      {isDownloading ? "Downloading..." : "Download case summary"}
    </a>
  );
}
