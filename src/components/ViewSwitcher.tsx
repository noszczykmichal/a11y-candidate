import { css } from 'styled-system/css';
import { type KeyboardEvent, useRef } from 'react';

import { copy, type ViewId, views } from '../data/fixtures';

export interface ViewSwitcherProps {
  activeView: ViewId;
  onViewChange: (view: ViewId) => void;
}

const tabClass = css({
  alignItems: 'center',
  borderBottomColor: 'transparent',
  borderBottomStyle: 'solid',
  borderBottomWidth: 'sm',
  color: 'text.primary',
  cursor: 'pointer',
  display: 'inline-flex',
  px: '4',
  py: '2',
  textStyle: 't_small_b',
  _hover: { color: 'text.link_hover' },
  '&[aria-selected=true]': {
    borderBottomColor: 'border.selected',
    color: 'text.selected',
  },
  _focusVisible: {
    outlineColor: 'focus.default',
    outlineOffset: '0.125rem',
    outlineStyle: 'solid',
    outlineWidth: '0.125rem',
  },
});

export function ViewSwitcher({ activeView, onViewChange }: ViewSwitcherProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const last = views.length - 1;
    let next: number | null = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
      next = index === last ? 0 : index + 1;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
      next = index === 0 ? last : index - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = last;

    if (next === null) return;

    const nextView = views[next];
    if (!nextView) return;

    event.preventDefault();
    tabRefs.current[next]?.focus();
    onViewChange(nextView.id);
  };

  return (
    <div
      role="tablist"
      aria-label={copy.views}
      className={css({
        borderBottomColor: 'border.secondary',
        borderBottomStyle: 'solid',
        borderBottomWidth: 'xs',
        display: 'flex',
        flexDirection: { base: 'column', md: 'row' },
        gap: '2',
      })}
    >
      {views.map((view, index) => {
        const selected = view.id === activeView;
        return (
          <button
            key={view.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${view.id}`}
            aria-selected={selected}
            aria-controls="view-panel"
            tabIndex={selected ? 0 : -1}
            className={tabClass}
            onClick={() => onViewChange(view.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {view.label}
          </button>
        );
      })}
    </div>
  );
}

ViewSwitcher.displayName = 'ViewSwitcher';
