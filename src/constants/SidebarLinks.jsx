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
        targetLink: '/',
        icon: HomeIcon,
      },
      {
        label: 'Discover',
        targetLink: '/discover',
        icon: SparklesIcon,
      },
      {
        label: 'Genres',
        targetLink: '/genres',
        icon: MusicalNoteIcon,
      },
    ],
    userLibLinks: [
      {
        label: 'Favorites',
        targetLink: '/favorites',
        icon: HeartIcon,
      },
      {
        label: 'Recently Played',
        targetLink: '/recents',
        icon: CalendarDateRangeIcon,
      },
    ],
  },
];
