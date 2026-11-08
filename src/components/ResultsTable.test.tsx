import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { copy, results } from '../data/fixtures';
import { ResultsTable } from './ResultsTable';

const columnValues = (columnIndex: number) =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[columnIndex]?.textContent);

const headerOf = (buttonName: string) =>
  screen.getByRole('button', { name: buttonName }).closest('th');

describe('ResultsTable accessibility', () => {
  it('names each sort button after the column it sorts (2.5.3)', async () => {
    const user = userEvent.setup();
    render(<ResultsTable />);

    await user.click(screen.getByRole('button', { name: copy.sortByBib }));

    const expected = results
      .map((row) => row.bib)
      .toSorted((a, b) => b - a)
      .map(String);
    expect(columnValues(1)).toEqual(expected);
  });

  it('exposes the current sort column and direction (1.3.1)', async () => {
    const user = userEvent.setup();
    render(<ResultsTable />);

    expect(headerOf(copy.sortByRank)).toHaveAttribute('aria-sort', 'ascending');
    expect(headerOf(copy.sortByBib)).not.toHaveAttribute('aria-sort');

    await user.click(screen.getByRole('button', { name: copy.sortByBib }));

    expect(headerOf(copy.sortByBib)).toHaveAttribute('aria-sort', 'descending');
    expect(headerOf(copy.sortByRank)).not.toHaveAttribute('aria-sort');
  });

  it('labels the athlete column (1.3.1)', () => {
    render(<ResultsTable />);

    expect(
      screen.getByRole('columnheader', { name: copy.athlete }),
    ).toBeInTheDocument();
  });

  it('shows qualification status as text (1.4.1)', () => {
    render(<ResultsTable />);

    const expected = [...results]
      .sort((a, b) => a.rank - b.rank)
      .map((row) => copy.standing[row.standing]);
    expect(columnValues(4)).toEqual(expected);
  });

  it('renders a single table (1.3.1)', () => {
    render(<ResultsTable />);

    expect(screen.getAllByRole('table')).toHaveLength(1);
  });

  it('makes the scrollable container focusable and named (2.1.1)', () => {
    render(<ResultsTable />);

    expect(
      screen.getByRole('region', { name: copy.resultsCaption }),
    ).toHaveAttribute('tabindex', '0');
  });
});
