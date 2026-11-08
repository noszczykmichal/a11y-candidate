import { useState } from 'react';
import { css } from 'styled-system/css';

import { copy, type Session } from '../data/fixtures';

export interface ScheduleListProps {
  sessions: readonly Session[];
}

const detailsButtonClass = css({
  bg: 'surface.base',
  borderColor: 'border.primary',
  borderRadius: 'md',
  borderStyle: 'solid',
  borderWidth: 'xs',
  color: 'text.primary',
  cursor: 'pointer',
  h: '10',
  px: '4',
  textStyle: 't_small_b',
  _hover: { bg: 'surface.subtle' },
  _focusVisible: {
    outlineColor: 'focus.default',
    outlineOffset: '0.125rem',
    outlineStyle: 'solid',
    outlineWidth: '0.125rem',
  },
});

export function ScheduleList({ sessions }: ScheduleListProps) {
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );

  const handleToggle = (sessionId: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(sessionId)) {
        next.delete(sessionId);
      } else {
        next.add(sessionId);
      }
      return next;
    });
  };

  return (
    <ul
      role="list"
      className={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '3',
        listStyle: 'none',
        m: '0',
        p: '0',
      })}
    >
      {sessions.map((session) => {
        const isExpanded = expandedIds.has(session.id);

        return (
          <li
            key={session.id}
            className={css({
              alignItems: { md: 'center' },
              bg: 'surface.base',
              borderColor: 'border.secondary',
              borderRadius: 'lg',
              borderStyle: 'solid',
              borderWidth: 'xs',
              display: 'flex',
              flexDirection: { base: 'column', md: 'row' },
              flexWrap: 'wrap',
              gap: '3',
              p: '4',
            })}
          >
            <h2
              className={css({ color: 'text.primary', textStyle: 'h_small' })}
            >
              {session.name}
            </h2>
            <p
              className={css({ color: 'text.secondary', textStyle: 't_small' })}
            >
              {session.venue}
            </p>
            <p className={css({ color: 'text.primary', textStyle: 't_small' })}>
              {session.status}
            </p>
            <button
              type="button"
              aria-expanded={isExpanded}
              className={detailsButtonClass}
              onClick={() => handleToggle(session.id)}
            >
              {copy.details}
              <span className={css({ srOnly: true })}>{session.name}</span>
            </button>
            {isExpanded && (
              <p
                className={css({
                  color: 'text.primary',
                  flexBasis: '100%',
                  textStyle: 't_small',
                  w: 'full',
                })}
              >
                {session.detail}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

ScheduleList.displayName = 'ScheduleList';
