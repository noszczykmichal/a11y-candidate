import { css, cx } from 'styled-system/css';
import { Box } from 'styled-system/jsx';
import { useId, useState } from 'react';

import { type AthleteResult, copy, results } from '../data/fixtures';

type SortColumn = 'rank' | 'bib';

type SortDirection = 'asc' | 'desc';

interface ColumnDirections {
  rank: SortDirection;
  bib: SortDirection;
}

const tableClass = css({
  borderCollapse: 'collapse',
  color: 'text.primary',
  textStyle: 't_small',
  w: 'full',
});

const captionClass = css({
  color: 'text.primary',
  pb: '3',
  textAlign: 'left',
  textStyle: 'h_small',
});

const headerCellClass = css({
  bg: 'surface.base_alt',
  borderBottomColor: 'border.primary',
  borderBottomStyle: 'solid',
  borderBottomWidth: 'xs',
  color: 'text.primary',
  px: '3',
  py: '2',
  textAlign: 'left',
});

const bodyCellClass = css({
  borderBottomColor: 'border.secondary',
  borderBottomStyle: 'solid',
  borderBottomWidth: 'xs',
  px: '3',
  py: '2',
  textAlign: 'left',
});

const sortButtonClass = css({
  bg: 'transparent',
  borderWidth: '0',
  color: 'text.primary',
  cursor: 'pointer',
  p: '0',
  textStyle: 't_small_b',
  _focusVisible: {
    outlineColor: 'focus.default',
    outlineOffset: '0.125rem',
    outlineStyle: 'solid',
    outlineWidth: '0.125rem',
  },
});

const standingClass = {
  Qualified: css({ bg: 'feedback.success.bg', color: 'text.primary' }),
  Eliminated: css({ bg: 'feedback.error.bg', color: 'text.primary' }),
} as const;

const flipDirection = (direction: SortDirection): SortDirection =>
  direction === 'asc' ? 'desc' : 'asc';

const sortResults = (
  rows: readonly AthleteResult[],
  column: SortColumn,
  direction: SortDirection,
): AthleteResult[] =>
  rows.toSorted((left, right) => {
    const delta = left[column] - right[column];
    return direction === 'asc' ? delta : -delta;
  });

export function ResultsTable() {
  const [column, setColumn] = useState<SortColumn>('rank');
  const [directions, setDirections] = useState<ColumnDirections>({
    rank: 'asc',
    bib: 'asc',
  });
  const captionId = useId();

  const handleSort = (nextColumn: SortColumn) => {
    setDirections((current) => ({
      ...current,
      [nextColumn]: flipDirection(current[nextColumn]),
    }));
    setColumn(nextColumn);
  };

  const sortedRows = sortResults(results, column, directions[column]);

  const ariaSort = (c: SortColumn) =>
    column === c
      ? directions[c] === 'asc'
        ? 'ascending'
        : 'descending'
      : undefined;

  return (
    <Box
      overflowX="auto"
      tabIndex={0}
      role="region"
      aria-labelledby={captionId}
      _focusVisible={{
        outlineColor: 'focus.default',
        outlineOffset: '0.125rem',
        outlineStyle: 'solid',
        outlineWidth: '0.125rem',
      }}
    >
      <table className={tableClass}>
        <caption id={captionId} className={captionClass}>
          {copy.resultsCaption}
        </caption>
        <thead>
          <tr>
            <th className={headerCellClass} aria-sort={ariaSort('rank')}>
              <button
                type="button"
                aria-label={copy.sortByRank}
                className={sortButtonClass}
                onClick={() => handleSort('rank')}
              >
                {copy.rank}
              </button>
            </th>
            <th className={headerCellClass} aria-sort={ariaSort('bib')}>
              <button
                type="button"
                aria-label={copy.sortByBib}
                className={sortButtonClass}
                onClick={() => handleSort('bib')}
              >
                {copy.bib}
              </button>
            </th>
            <th className={headerCellClass}>{copy.athlete}</th>
            <th className={headerCellClass}>{copy.noc}</th>
            <th className={headerCellClass}>{copy.status}</th>
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row) => (
            <tr key={row.bib}>
              <td className={bodyCellClass}>{row.rank}</td>
              <td className={bodyCellClass}>{row.bib}</td>
              <td className={bodyCellClass}>{row.athlete}</td>
              <td className={bodyCellClass}>{row.noc}</td>
              <td className={cx(bodyCellClass, standingClass[row.standing])}>
                {copy.standing[row.standing]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}

ResultsTable.displayName = 'ResultsTable';
