import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import type { ViewId } from '../data/fixtures';
import { ViewSwitcher } from './ViewSwitcher';

function Harness() {
  const [activeView, setActiveView] = useState<ViewId>('schedule');
  return <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />;
}

describe('ViewSwitcher accessibility (4.1.2)', () => {
  it('renders tabs as buttons with a single Tab stop', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
    tabs.forEach((tab) => expect(tab.tagName).toBe('BUTTON'));

    const schedule = screen.getByRole('tab', { name: 'Schedule' });
    expect(schedule).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Results' })).toHaveAttribute(
      'tabindex',
      '-1',
    );

    await user.tab();
    expect(schedule).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('tab', { name: 'Results' })).not.toHaveFocus();
  });

  it('moves focus and selection with arrow keys, wrapping at both ends', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.tab();
    await user.keyboard('{ArrowRight}');
    const results = screen.getByRole('tab', { name: 'Results' });
    expect(results).toHaveFocus();
    expect(results).toHaveAttribute('aria-selected', 'true');
    expect(results).toHaveAttribute('tabindex', '0');

    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    const medals = screen.getByRole('tab', { name: 'Medals' });
    expect(medals).toHaveFocus();
    expect(medals).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Schedule' })).toHaveFocus();
  });

  it('jumps to the first and last tab with Home and End', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.tab();
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Medals' })).toHaveFocus();

    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Schedule' })).toHaveFocus();
  });
});
