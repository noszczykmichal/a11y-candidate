import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { copy } from '../data/fixtures';
import { SiteHeader, STATUS_TIMEOUT_MS } from './SiteHeader';

const renderHeader = () => render(<SiteHeader onManageAlerts={() => {}} />);

describe('SiteHeader accessibility', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Course card (1.1.1, 1.4.5)', () => {
    it('renders the course details as text instead of an image', () => {
      renderHeader();

      expect(screen.getByText(copy.courseTitle)).toBeInTheDocument();
      expect(screen.getByText(copy.courseDetails)).toBeInTheDocument();
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('does not expose the card title as a heading', () => {
      renderHeader();

      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(1);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        copy.heading,
      );
    });
  });

  describe('Favourite button (4.1.2)', () => {
    it('has an accessible name and exposes its pressed state', async () => {
      const user = userEvent.setup();
      renderHeader();

      const addToFavButton = screen.getByRole('button', {
        name: copy.addToFavourites,
      });
      expect(addToFavButton).toHaveAttribute('aria-pressed', 'false');

      await user.click(addToFavButton);
      expect(addToFavButton).toHaveAttribute('aria-pressed', 'true');

      await user.click(addToFavButton);
      expect(addToFavButton).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('Copy link button (2.4.6)', () => {
    it('is named after its action', () => {
      renderHeader();

      expect(
        screen.getByRole('button', { name: copy.copyLink }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Menu' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('"Link copied" status message (4.1.3)', () => {
    it('renders the status region before the link is copied', () => {
      renderHeader();

      expect(screen.getByRole('status').textContent).toBe('');
    });

    it('shows the message and clears it after 5 seconds', () => {
      vi.useFakeTimers({
        toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame'],
      });
      renderHeader();

      const status = screen.getByRole('status');
      fireEvent.click(screen.getByRole('button', { name: copy.copyLink }));
      act(() => {
        vi.advanceTimersToNextFrame();
      });
      expect(status).toHaveTextContent(copy.linkCopied);

      act(() => {
        vi.advanceTimersByTime(STATUS_TIMEOUT_MS);
      });
      expect(status.textContent).toBe('');
    });

    it('clears and sets the message again on repeated activation', () => {
      vi.useFakeTimers({
        toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame'],
      });
      renderHeader();

      const status = screen.getByRole('status');
      const copyLinkButton = screen.getByRole('button', {
        name: copy.copyLink,
      });

      fireEvent.click(copyLinkButton);
      act(() => {
        vi.advanceTimersToNextFrame();
      });
      expect(status).toHaveTextContent(copy.linkCopied);

      fireEvent.click(copyLinkButton);
      expect(status.textContent).toBe('');

      act(() => {
        vi.advanceTimersToNextFrame();
      });
      expect(status).toHaveTextContent(copy.linkCopied);
    });
  });
});
