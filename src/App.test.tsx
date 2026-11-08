import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { App } from './App';
import { copy } from './data/fixtures';

describe('Championship Day', () => {
  it('renders the page heading', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Championship Day' }),
    ).toBeInTheDocument();
  });

  it('shows every heat on the schedule', () => {
    render(<App />);

    expect(screen.getByText('Heat 1')).toBeInTheDocument();
    expect(screen.getByText('Heat 2')).toBeInTheDocument();
    expect(screen.getByText('Heat 3')).toBeInTheDocument();
  });

  it('shows finished sessions when Finished is chosen', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Finished' }));

    expect(screen.getByText('Heat 2')).toBeInTheDocument();
    expect(screen.queryByText('Heat 1')).not.toBeInTheDocument();
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

    const [heatOneDetails] = screen.getAllByRole('button', { name: 'Details' });
    if (heatOneDetails === undefined) {
      throw new Error('Expected a Details control');
    }

    await user.click(heatOneDetails);

    expect(screen.getByText('First run starts at 10:15.')).toBeInTheDocument();
  });

  it('opens and closes alert preferences', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Manage alerts' }));
    expect(screen.getByText('Heat changes')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByText('Heat changes')).not.toBeInTheDocument();
  });

  it('shows a confirmation when the share control is used', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: copy.copyLink }));

    expect(screen.getByText('Link copied')).toBeInTheDocument();
  });
});
