import { describe, expect, it } from 'vitest';
import { render, fireEvent, within, waitFor } from '@testing-library/react';
import InteractiveExamPreview from './InteractiveExamPreview';

describe('InteractiveExamPreview', () => {
  it('renders the glycolysis sample question and reveals rationale on select', () => {
    const { container } = render(<InteractiveExamPreview />);
    const preview = within(container);

    expect(
      preview.getByText(/Which enzyme catalyzes the committed, primary rate limiting step of glycolysis/i)
    ).toBeInTheDocument();

    const options = preview.getAllByRole('radio');
    fireEvent.click(options[1]);

    expect(preview.getByText(/Correct\./i)).toBeInTheDocument();
    expect(preview.getByText(/Fructose 1,6 Bisphosphate/i)).toBeInTheDocument();
  });

  it('resets the selected answer when Reset is clicked', async () => {
    const { container } = render(<InteractiveExamPreview />);
    const preview = within(container);
    const options = preview.getAllByRole('radio');

    fireEvent.click(options[0]);
    expect(preview.getByText(/Common trap\./i)).toBeInTheDocument();

    fireEvent.click(preview.getByRole('button', { name: /Reset/i }));
    await waitFor(() => {
      expect(preview.queryByText(/Common trap\./i)).not.toBeInTheDocument();
    });
  });
});
