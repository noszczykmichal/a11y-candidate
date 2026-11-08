import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { copy, sessions } from '../data/fixtures';
import { ScheduleList } from './ScheduleList';

describe('ScheduleList accessibility', () => {
  it('gives each Details button a unique name starting with the visible label (2.4.6, 2.5.3)', () => {
    render(<ScheduleList sessions={sessions} />);

    for (const session of sessions) {
      expect(
        screen.getByRole('button', {
          name: `${copy.details} ${session.name}`,
        }),
      ).toBeInTheDocument();
    }
  });

  it('keeps the expand/collapse state exposed on the renamed button', async () => {
    const user = userEvent.setup();
    const session = sessions[0];
    if (!session) throw new Error('Expected at least one session in fixtures');
    render(<ScheduleList sessions={sessions} />);

    const button = screen.getByRole('button', {
      name: `${copy.details} ${session.name}`,
    });
    expect(button).toHaveAttribute('aria-expanded', 'false');

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(session.detail)).toBeInTheDocument();
  });

  it('exposes the sessions as a list (1.3.1)', () => {
    render(<ScheduleList sessions={sessions} />);

    const list = screen.getByRole('list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(sessions.length);
  });
});
