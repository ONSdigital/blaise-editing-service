import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { DownloadCaseSummaryLink, Props } from '../../../../client/Common/components/DownloadCaseSummaryLink';
import { getCaseSummary } from '../../../../client/api/NodeApi';
import mapCaseSummaryText from '../../../../client/Mappers/caseSummaryTextMapper';
import { caseSummaryDetailsMockObject } from '../../../server/mockObjects/CaseMockObject';

vi.mock('../../../../client/api/NodeApi', () => ({
  getCaseSummary: vi.fn(),
}));

vi.mock('../../../../client/Mappers/caseSummaryTextMapper', () => ({ default: vi.fn() }));

const mockGetCaseSummary = getCaseSummary as vi.Mock;
const mockMapCaseSummaryText = mapCaseSummaryText as vi.Mock;

describe('Given a user needs to download a case summary', () => {
  const defaultProps: Props = {
    caseId: '12345',
    questionnaireName: 'FRS1337',
  };

  let mockLinkClick: vi.Mock;
  let mockCreateElement: vi.SpyInstance;

  const originalCreateElement = document.createElement;

  beforeEach(() => {
    vi.clearAllMocks();

    mockLinkClick = vi.fn();

    mockCreateElement = vi.spyOn(document, 'createElement');
    mockCreateElement.mockImplementation((tagName: string, options?: ElementCreationOptions) => {
      if (tagName.toLowerCase() === 'a') {
        return {
          href: '',
          download: '',
          click: mockLinkClick,
        } as unknown as HTMLAnchorElement;
      }
      return originalCreateElement.call(document, tagName, options);
    });

    // eslint-disable-next-line no-console
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    mockCreateElement.mockRestore();
    vi.restoreAllMocks();
  });

  const mockCaseSummaryDetails = caseSummaryDetailsMockObject;

  const mockFileContent = 'Case ID: 12345\nStatus: Completed';

  it('renders correctly with default props', () => {
    // act
    render(<DownloadCaseSummaryLink caseId={defaultProps.caseId} questionnaireName={defaultProps.questionnaireName} />);

    // assert
    const linkElement = screen.getByText('Download case summary');
    expect(linkElement).toBeInTheDocument();
  });

  it('handles successful download on click', async () => {
    // arrange
    mockGetCaseSummary.mockResolvedValue(mockCaseSummaryDetails);
    mockMapCaseSummaryText.mockReturnValue(mockFileContent);

    render(<DownloadCaseSummaryLink caseId={defaultProps.caseId} questionnaireName={defaultProps.questionnaireName} />);
    const linkElement = screen.getByText('Download case summary');

    // act
    fireEvent.click(linkElement);

    // assert
    expect(screen.getByText('Downloading...')).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('aria-disabled', 'true');

    await waitFor(() => {
      expect(mockGetCaseSummary).toHaveBeenCalledWith(defaultProps.questionnaireName, defaultProps.caseId);
    });

    expect(mockMapCaseSummaryText).toHaveBeenCalledWith(mockCaseSummaryDetails);
    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockLinkClick).toHaveBeenCalled();
    await waitFor(() => expect(screen.getByText('Download case summary')).toBeInTheDocument());
    expect(linkElement).toHaveAttribute('aria-disabled', 'false');
  });

  it('handles successful download on Enter key press', async () => {
    // arrange
    mockGetCaseSummary.mockResolvedValue(mockCaseSummaryDetails);
    mockMapCaseSummaryText.mockReturnValue(mockFileContent);
    render(<DownloadCaseSummaryLink caseId={defaultProps.caseId} questionnaireName={defaultProps.questionnaireName} />);
    const linkElement = screen.getByText('Download case summary');

    // act
    fireEvent.keyDown(linkElement, { key: 'Enter', code: 'Enter' });

    // assert
    expect(screen.getByText('Downloading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetCaseSummary).toHaveBeenCalledWith(defaultProps.questionnaireName, defaultProps.caseId);
    });
    expect(mockLinkClick).toHaveBeenCalled();

    await waitFor(() => expect(screen.getByText('Download case summary')).toBeInTheDocument());
  });

  it('handles failed download and calls onError callback', async () => {
    // arrange
    const errorMessage = 'Failed download';
    mockGetCaseSummary.mockRejectedValue(new Error(errorMessage));
    const mockOnError = vi.fn();
    const propsWithOnError = { ...defaultProps, onError: mockOnError };
    render(<DownloadCaseSummaryLink caseId={propsWithOnError.caseId} questionnaireName={propsWithOnError.questionnaireName} onError={propsWithOnError.onError} />);
    const linkElement = screen.getByText('Download case summary');

    // act
    fireEvent.click(linkElement);

    // assert
    expect(screen.getByText('Downloading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetCaseSummary).toHaveBeenCalledWith(defaultProps.questionnaireName, defaultProps.caseId);
    });
    expect(mockOnError).toHaveBeenCalledWith('Failed to download case summary. Please try again later or contact support for assistance.');

    expect(console.error).toHaveBeenCalledWith(
      `Failed to export summary for caseId: ${defaultProps.caseId}:`,
      expect.any(Error),
    );
    await waitFor(() => expect(screen.getByText('Download case summary')).toBeInTheDocument());
    expect(linkElement).toHaveAttribute('aria-disabled', 'false');
  });

  it('does not trigger download if already downloading', async () => {
    // arrange
    mockGetCaseSummary.mockImplementation(() => new Promise((resolve) => { setTimeout(() => resolve(mockCaseSummaryDetails), 50); }));
    mockMapCaseSummaryText.mockReturnValue(mockFileContent);

    render(<DownloadCaseSummaryLink caseId={defaultProps.caseId} questionnaireName={defaultProps.questionnaireName} />);
    const linkElement = screen.getByText('Download case summary');

    // act
    fireEvent.click(linkElement);
    expect(screen.getByText('Downloading...')).toBeInTheDocument();
    fireEvent.click(linkElement);

    // assert
    await waitFor(() => {
      expect(mockGetCaseSummary).toHaveBeenCalledTimes(1);
      expect(mockLinkClick).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => expect(screen.getByText('Download case summary')).toBeInTheDocument());
  });
});
