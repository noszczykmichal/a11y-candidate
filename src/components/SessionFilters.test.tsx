import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { copy, type SessionFilterId } from '../data/fixtures';
import { SessionFilters } from './SessionFilters';

function Harness() {
  const [activeFilter, setActiveFilter] = useState<SessionFilterId>('all');
  return (
    <SessionFilters
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
    />
  );
}

describe('SessionFilters accessibility', () => {
  it('reaches every filter with Tab (2.1.1)', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    for (const label of ['Live only', 'All sessions', 'Finished']) {
      await user.tab();
      expect(screen.getByRole('button', { name: label })).toHaveFocus();
    }
  });

  it('activates a filter with Enter and Space (2.1.1)', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(
      <SessionFilters activeFilter="all" onFilterChange={onFilterChange} />,
    );

    await user.tab();
    await user.keyboard('{Enter}');
    expect(onFilterChange).toHaveBeenCalledTimes(1);

    await user.tab();
    await user.tab();
    await user.keyboard(' ');
    expect(onFilterChange).toHaveBeenCalledTimes(2);
  });

  it('exposes the selected filter with aria-pressed (4.1.2)', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    expect(
      screen.getByRole('button', { name: 'All sessions' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Finished' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );

    await user.click(screen.getByRole('button', { name: 'Finished' }));
    expect(screen.getByRole('button', { name: 'Finished' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(
      screen.getByRole('button', { name: 'All sessions' }),
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it('names the filter group (1.3.1)', () => {
    render(<Harness />);

    const group = screen.getByRole('group', { name: copy.filterSessions });
    expect(within(group).getAllByRole('button')).toHaveLength(3);
  });
});
