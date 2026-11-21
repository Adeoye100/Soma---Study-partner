import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AppIcon } from './AppIcon';

describe('AppIcon', () => {
  it('renders light and dark logo images with rounded circular corners', () => {
    const { container } = render(<AppIcon className="size-10" alt="Somma Study Partner" />);
    
    const wrapper = container.querySelector('div');
    expect(wrapper).toBeTruthy();
    expect(wrapper?.className).toContain('rounded-full');
    expect(wrapper?.className).toContain('overflow-hidden');

    const images = container.querySelectorAll('img');
    expect(images.length).toBe(2);

    const lightImg = images[0];
    const darkImg = images[1];

    expect(lightImg.getAttribute('src')).toBe('/Somma-logo-white.jpeg');
    expect(lightImg.getAttribute('alt')).toBe('Somma Study Partner');
    expect(lightImg.className).toContain('rounded-full');
    expect(lightImg.className).toContain('dark:hidden');

    expect(darkImg.getAttribute('src')).toBe('/Somma-logo.jpeg');
    expect(darkImg.getAttribute('alt')).toBe('Somma Study Partner');
    expect(darkImg.className).toContain('rounded-full');
    expect(darkImg.className).toContain('hidden');
    expect(darkImg.className).toContain('dark:block');
  });
});
