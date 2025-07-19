import {
  CalendarDateRangeIcon,
  HeartIcon,
  HomeIcon,
  MusicalNoteIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

export const SidebarLinks = [
  {
    mainLinks: [
      {
        label: 'Home',
        targetLink: '#',
        icon: HomeIcon,
      },
      {
        label: 'Discover',
        targetLink: '#',
        icon: SparklesIcon,
      },
      {
        label: 'Genres',
        targetLink: '#',
        icon: MusicalNoteIcon,
      },
    ],
    userLibLinks: [
      {
        label: 'Favorites',
        targetLink: '#',
        icon: HeartIcon,
      },
      {
        label: 'Recently Played',
        targetLink: '#',
        icon: CalendarDateRangeIcon,
      },
    ],
  },
];
