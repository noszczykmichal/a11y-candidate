import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { App } from './App';
import { copy } from './data/fixtures';
import axe from 'axe-core';

describe('Championship Day', () => {
  it('renders the page heading', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Championship Day' }),
    ).toBeInTheDocument();
  });

  it('shows every heat on the schedule', () => {
    render(<App />);

    expect(
      screen.getByRole('button', { name: 'Details Heat 1' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Details Heat 2' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Details Heat 3' }),
    ).toBeInTheDocument();
  });

  it('shows finished sessions when Finished is chosen', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Finished' }));

    expect(
      screen.getByRole('button', { name: 'Details Heat 2' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Details Heat 1' }),
    ).not.toBeInTheDocument();
  });

  it('shows an athlete when Results is chosen', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('tab', { name: 'Results' }));

    expect(screen.getByText('Lena Berg')).toBeInTheDocument();
  });

  it('shows the medal ceremonies note when Medals is chosen', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('tab', { name: 'Medals' }));

    expect(
      screen.getByText('Medal ceremonies are published after the final heat.'),
    ).toBeInTheDocument();
  });

  it('shows the heat detail when Details is activated', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Details Heat 1' }));

    expect(screen.getByText('First run starts at 10:15.')).toBeInTheDocument();
  });

  it('opens and closes alert preferences', async () => {
    const user = userEvent.setup();
    render(<App />);

    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(dialog).not.toHaveAttribute('open');

    await user.click(screen.getByRole('button', { name: 'Manage alerts' }));
    expect(dialog).toHaveAttribute('open');

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(dialog).not.toHaveAttribute('open');
  });

  it('shows a confirmation when the share control is used', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: copy.copyLink }));

    expect(screen.getByText('Link copied')).toBeInTheDocument();
  });

  it.each(['Schedule', 'Results', 'Medals'])(
    'has no axe violations in the %s view',
    async (tab) => {
      const user = userEvent.setup();
      const { container } = render(<App />);
      await user.click(screen.getByRole('tab', { name: tab }));

      const results = await axe.run(container, {
        rules: { 'color-contrast': { enabled: false } },
      });
      expect(results.violations).toEqual([]);
    },
  );
});
