import { css } from 'styled-system/css';
import { Stack } from 'styled-system/jsx';
import { useCallback, useState } from 'react';

import { AlertsModal } from './components/AlertsModal';
import { ResultsTable } from './components/ResultsTable';
import { ScheduleList } from './components/ScheduleList';
import { SessionFilters } from './components/SessionFilters';
import { SiteHeader } from './components/SiteHeader';
import { ViewSwitcher } from './components/ViewSwitcher';
import {
  copy,
  filterSessions,
  type SessionFilterId,
  sessions,
  type ViewId,
} from './data/fixtures';

export function App() {
  const [activeView, setActiveView] = useState<ViewId>('schedule');
  const [activeFilter, setActiveFilter] = useState<SessionFilterId>('all');
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  const handleCloseAlerts = useCallback(() => {
    setIsAlertsOpen(false);
  }, []);

  const visibleSessions = filterSessions(sessions, activeFilter);

  return (
    <main
      className={css({
        color: 'text.primary',
        maxW: { md: '48rem' },
        mx: 'auto',
        px: { base: '4', md: '8' },
        py: { base: '6', md: '8' },
        w: 'full',
      })}
    >
      <Stack gap="6">
        <SiteHeader onManageAlerts={() => setIsAlertsOpen(true)} />
        <AlertsModal onClose={handleCloseAlerts} open={isAlertsOpen} />
        <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />
        {activeView === 'schedule' && (
          <section
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '4',
            })}
          >
            <SessionFilters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
            <ScheduleList sessions={visibleSessions} />
          </section>
        )}
        {activeView === 'results' && (
          <section>
            <ResultsTable />
          </section>
        )}
        {activeView === 'medals' && (
          <section>
            <p
              className={css({ color: 'text.primary', textStyle: 't_medium' })}
            >
              {copy.medals}
            </p>
          </section>
        )}
      </Stack>
    </main>
  );
}

App.displayName = 'App';
