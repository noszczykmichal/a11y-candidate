import { css } from 'styled-system/css';
import { Stack } from 'styled-system/jsx';
import { type KeyboardEvent, useEffect, useRef } from 'react';

import { copy } from '../data/fixtures';

export interface AlertsModalProps {
  onClose: () => void;
}

const closeButtonClass = css({
  alignSelf: 'flex-start',
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

const checkboxClass = css({
  accentColor: 'graphics.brand',
  h: '5',
  w: '5',
  _focusVisible: {
    outlineColor: 'focus.default',
    outlineOffset: '0.125rem',
    outlineStyle: 'solid',
    outlineWidth: '0.125rem',
  },
});

const labelClass = css({
  alignItems: 'center',
  color: 'text.primary',
  cursor: 'pointer',
  display: 'flex',
  gap: '3',
  textStyle: 't_medium',
});

export function AlertsModal({ onClose }: AlertsModalProps) {
  const heatChangesRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    heatChangesRef.current?.focus();
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className={css({
        alignItems: 'center',
        bg: 'surface.scrim',
        display: 'flex',
        inset: '0',
        justifyContent: 'center',
        p: '4',
        position: 'fixed',
        zIndex: '10',
      })}
    >
      <div
        role="dialog"
        onKeyDown={handleKeyDown}
        className={css({
          bg: 'surface.elevated',
          borderColor: 'border.secondary',
          borderRadius: 'lg',
          borderStyle: 'solid',
          borderWidth: 'xs',
          color: 'text.primary',
          maxW: '24rem',
          p: '6',
          w: 'full',
        })}
      >
        <Stack gap="4">
          <h2 className={css({ color: 'text.primary', textStyle: 'h_small' })}>
            {copy.alertTitle}
          </h2>
          <Stack gap="3">
            <label className={labelClass}>
              <input
                ref={heatChangesRef}
                type="checkbox"
                className={checkboxClass}
              />
              {copy.heatChanges}
            </label>
            <label className={labelClass}>
              <input type="checkbox" className={checkboxClass} />
              {copy.medalCeremonies}
            </label>
          </Stack>
          <button type="button" className={closeButtonClass} onClick={onClose}>
            {copy.close}
          </button>
        </Stack>
      </div>
    </div>
  );
}

AlertsModal.displayName = 'AlertsModal';
