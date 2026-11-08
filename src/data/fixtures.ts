export type ViewId = 'schedule' | 'results' | 'medals';

export type SessionFilterId = 'live' | 'all' | 'finished';

export type SessionStatus = 'Live' | 'Finished' | 'Upcoming';

export type ResultStanding = 'Qualified' | 'Eliminated';

export interface ViewOption {
  id: ViewId;
  label: string;
  href: string;
}

export interface SessionFilterOption {
  id: SessionFilterId;
  label: string;
}

export interface Session {
  id: string;
  name: string;
  venue: string;
  status: SessionStatus;
  detail: string;
}

export interface AthleteResult {
  rank: number;
  bib: number;
  athlete: string;
  noc: string;
  standing: ResultStanding;
}

export const copy = {
  heading: 'Championship Day',
  event: "Alpine skiing — women's slalom",
  date: '12 February',
  courseTitle: 'Alpine skiing',
  courseDetails: 'Course: 58 gates, 180 m vertical drop',
  manageAlerts: 'Manage alerts',
  addToFavourites: 'Add to favourites',
  linkCopied: 'Link copied',
  copyLink: 'Copy link',
  medals: 'Medal ceremonies are published after the final heat.',
  details: 'Details',
  alertTitle: 'Alert preferences',
  heatChanges: 'Heat changes',
  medalCeremonies: 'Medal ceremonies',
  close: 'Close',
  resultsCaption: 'Heat results',
  rank: 'Rank',
  bib: 'Bib',
  noc: 'NOC',
  status: 'Status',
  statusMark: '—',
  views: 'Views',
  filterSessions: 'Filter sessions',
  athlete: 'Athlete',
  standing: { Qualified: 'Qualified', Eliminated: 'Eliminated' },
  sortByRank: 'Sort by rank',
  sortByBib: 'Sort by bib',
} as const;

export const views: readonly ViewOption[] = [
  { id: 'schedule', label: 'Schedule', href: '#schedule' },
  { id: 'results', label: 'Results', href: '#results' },
  { id: 'medals', label: 'Medals', href: '#medals' },
];

export const sessionFilters: readonly SessionFilterOption[] = [
  { id: 'live', label: 'Live only' },
  { id: 'all', label: 'All sessions' },
  { id: 'finished', label: 'Finished' },
];

export const sessions: readonly Session[] = [
  {
    id: 'heat-1',
    name: 'Heat 1',
    venue: 'Courchevel',
    status: 'Live',
    detail: 'First run starts at 10:15.',
  },
  {
    id: 'heat-2',
    name: 'Heat 2',
    venue: 'Courchevel',
    status: 'Finished',
    detail: 'Both runs are complete.',
  },
  {
    id: 'heat-3',
    name: 'Heat 3',
    venue: 'Meribel',
    status: 'Upcoming',
    detail: 'Start time is 14:40.',
  },
];

export const results: readonly AthleteResult[] = [
  { rank: 1, bib: 7, athlete: 'Lena Berg', noc: 'SWE', standing: 'Qualified' },
  { rank: 2, bib: 14, athlete: 'Maya Chen', noc: 'CAN', standing: 'Qualified' },
  {
    rank: 3,
    bib: 3,
    athlete: 'Sofia Rossi',
    noc: 'ITA',
    standing: 'Eliminated',
  },
  {
    rank: 4,
    bib: 21,
    athlete: 'Hana Novak',
    noc: 'CZE',
    standing: 'Eliminated',
  },
];

export const filterSessions = (
  items: readonly Session[],
  filter: SessionFilterId,
): Session[] => {
  if (filter === 'live') {
    return items.filter((session) => session.status === 'Live');
  }

  if (filter === 'finished') {
    return items.filter((session) => session.status === 'Finished');
  }

  return [...items];
};
