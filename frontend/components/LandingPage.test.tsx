import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from './LandingPage';

// Framer Motion's useInView and useMotionValue need a real DOM; mocking
// heavy third-party side-effects that don't affect what we're testing.
vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    context: (fn: () => void) => {
      fn();
      return { revert: vi.fn() };
    },
    set: vi.fn(),
    to: vi.fn(),
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {},
}));

vi.mock('./ThemeToggle', () => ({
  default: () => <button type="button">Toggle theme</button>,
}));

describe('LandingPage', () => {
  it('renders brand, headline, primary CTA, and key section headings', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // Brand name appears in nav
    expect(screen.getAllByText('Soma').length).toBeGreaterThan(0);

    // Hero headline words are present (rendered as individual spans)
    expect(screen.getByText('Turn')).toBeInTheDocument();
    expect(screen.getByText('know.')).toBeInTheDocument();

    // Primary CTA
    expect(screen.getByRole('button', { name: /Upload study material/i })).toBeInTheDocument();

    // Workflow section heading
    expect(
      screen.getByText(/From raw files to an adaptive study plan in four steps/i)
    ).toBeInTheDocument();

    // Features section heading
    expect(
      screen.getByText(/Built for how exams actually work/i)
    ).toBeInTheDocument();

    // FAQ section heading
    expect(
      screen.getByText(/Common questions before you start/i)
    ).toBeInTheDocument();

    // Footer CTA heading
    expect(
      screen.getByText(/Ready to test yourself on your own notes/i)
    ).toBeInTheDocument();
  });
});
