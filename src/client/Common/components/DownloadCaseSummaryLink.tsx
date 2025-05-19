import React, { useState } from 'react';
import mapCaseSummaryText from '../../Mappers/caseSummaryTextMapper';
import { getCaseSummary } from '../../api/NodeApi';

export interface Props {
  caseId: string;
  questionnaireName: string;
  onError?: (message: string) => void;
}

async function exportSummary(caseId: string, questionnaireName: string) {
  const fileName = `case-summary-${caseId}.txt`;
  console.log(`Attempting to prepare summary for caseId: ${caseId}, questionnaireName: ${questionnaireName}`);

  try {
    const caseSummaryDetails = await getCaseSummary(questionnaireName, caseId);
    let fileContent = mapCaseSummaryText(caseSummaryDetails);

    const link = document.createElement('a');
    link.download = fileName;

    fileContent = fileContent.replace(/\r\n?|\n/g, '\r\n');

    const encodedFileContent = encodeURIComponent(fileContent);
    link.href = `data:text/plain;charset=utf-8,${encodedFileContent}`;

    link.click();
    console.log(`Successfully triggered download for case-summary-${caseId}.txt`);
  } catch (error) {
    console.error(`Failed to export summary for caseId: ${caseId}:`, error);
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
    } catch (error) {
      onError?.('Failed to download case summary. Please try again later or contact support for assistance.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <span
      className="link"
      id={`download-${caseId}-summary`}
      onClick={isDownloading ? undefined : handleExport}
      onKeyDown={isDownloading ? undefined : (e) => e.key === 'Enter' && handleExport()}
      role="link"
      aria-label="Download case summary"
      tabIndex={0}
      aria-disabled={isDownloading}
      style={{ cursor: isDownloading ? 'default' : 'pointer', opacity: isDownloading ? 0.5 : 1 }}
    >
      {isDownloading ? 'Downloading...' : 'Download case summary'}
    </span>
  );
}
