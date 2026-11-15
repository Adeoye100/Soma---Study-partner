import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import InteractiveExamPreview from './InteractiveExamPreview';

global.requestAnimationFrame = (cb) => { cb(0); return 0; };

/** Helper: get the first matching tab button regardless of duplicates from AnimatePresence. */
function getFirstTab(name: RegExp) {
  return screen.getAllByRole('tab', { name })[0];
}

describe('InteractiveExamPreview', () => {
  it('renders three distinct tab labels', () => {
    render(<InteractiveExamPreview />);
    expect(screen.getAllByRole('tab', { name: /Source material/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('tab', { name: /Live session/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('tab', { name: /Graded review/i }).length).toBeGreaterThan(0);
  });

  it('shows source material content by default', () => {
    render(<InteractiveExamPreview />);
    expect(getFirstTab(/Source material/i)).toHaveAttribute('aria-selected', 'true');
    // Use getAllByText to tolerate AnimatePresence rendering both old and new panels in jsdom
    expect(screen.getAllByText(/SEN 203/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/B-Tree indexing/i).length).toBeGreaterThan(0);
  });

  it('switches to live session and shows MCQ options', async () => {
    render(<InteractiveExamPreview />);

    fireEvent.click(getFirstTab(/Live session/i));

    await waitFor(() => {
      expect(screen.getByText(/B-Tree index with n leaf nodes/i)).toBeInTheDocument();
    });

    const options = screen.getAllByRole('radio');
    expect(options.length).toBe(4);
  });

  it('marks the correct option when clicked', async () => {
    render(<InteractiveExamPreview />);
    fireEvent.click(getFirstTab(/Live session/i));

    await waitFor(() => {
      expect(screen.getAllByRole('radio').length).toBe(4);
    });

    const correctOption = screen.getAllByRole('radio').find(
      (o) => o.textContent?.includes('O(log n)')
    );
    expect(correctOption).toBeDefined();
    fireEvent.click(correctOption!);

    expect(screen.getByLabelText('Correct')).toBeInTheDocument();
  });

  it('shows graded review content on the review tab', async () => {
    render(<InteractiveExamPreview />);

    fireEvent.click(getFirstTab(/Graded review/i));

    await waitFor(() => {
      expect(screen.getByText(/0.85 \/ 1.0/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Source excerpt/i)).toBeInTheDocument();
  });
});
