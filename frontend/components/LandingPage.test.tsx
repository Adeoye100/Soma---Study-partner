import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from './LandingPage';

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
  default: () => <button type="button">Theme</button>,
}));

describe('LandingPage', () => {
  it('renders brand, primary CTA, and core sections', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(screen.getAllByText('Soma').length).toBeGreaterThan(0);
    expect(screen.getByText(/Turn 80 slide lecture decks/i)).toBeInTheDocument();
    expect(screen.getByText(/into realistic mock exams in 30 seconds/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create your first exam free/i })).toBeInTheDocument();
    expect(screen.getByText(/Built for the way hard courses actually test you/i)).toBeInTheDocument();
    expect(screen.getByText(/Questions before you start/i)).toBeInTheDocument();
    expect(screen.getByText('Passive')).toBeInTheDocument();
    expect(screen.getByText('pressure.')).toBeInTheDocument();
  });
});
