import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { copy } from '../data/fixtures';
import { AlertsModal } from './AlertsModal';

describe('AlertsModal accessibility', () => {
  it('exposes the dialog with an accessible name (4.1.2)', () => {
    render(<AlertsModal open onClose={vi.fn()} />);

    expect(
      screen.getByRole('dialog', { name: copy.alertTitle }),
    ).toBeInTheDocument();
  });

  it('opens and closes as a native dialog controlled by the open prop (2.4.3)', () => {
    const { rerender } = render(<AlertsModal open={false} onClose={vi.fn()} />);
    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(dialog).not.toHaveAttribute('open');

    rerender(<AlertsModal open onClose={vi.fn()} />);
    expect(dialog).toHaveAttribute('open');

    rerender(<AlertsModal open={false} onClose={vi.fn()} />);
    expect(dialog).not.toHaveAttribute('open');
  });

  it('moves focus into the dialog when it opens', () => {
    render(<AlertsModal open onClose={vi.fn()} />);

    expect(
      screen.getByRole('checkbox', { name: copy.heatChanges }),
    ).toHaveFocus();
  });

  it('handles Escape through the cancel event and keeps state in React (2.4.3)', () => {
    const onClose = vi.fn();
    render(<AlertsModal open onClose={onClose} />);

    const notPrevented = fireEvent(
      screen.getByRole('dialog'),
      new Event('cancel', { cancelable: true }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(notPrevented).toBe(false);
  });
});
