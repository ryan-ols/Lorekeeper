import { MediaItem } from '../types';

export const getProgress = (item: MediaItem): { current: number; total: number; label: string } => {
  switch (item.type) {
    case 'series':
      return {
        current: item.currentEpisodeInSeason ?? 0,
        total: item.episodesInCurrentSeason ?? 0,
        label: `T${item.currentSeason ?? 1} · ep ${item.currentEpisodeInSeason ?? 0} de ${item.episodesInCurrentSeason ?? 0}`,
      };
    case 'anime':
      return {
        current: item.currentEpisode ?? 0,
        total: item.totalEpisodes ?? 0,
        label: 'episodes',
      };
    case 'manga':
      return {
        current: item.currentChapter ?? 0,
        total: item.totalChapters ?? 0,
        label: 'chapters',
      };
    case 'lightnovel':
      return {
        current: item.currentChapterInVolume ?? 0,
        total: item.chaptersInCurrentVolume ?? 0,
        label: `Vol.${item.currentVolume ?? 1} · cap ${item.currentChapterInVolume ?? 0} de ${item.chaptersInCurrentVolume ?? 0}`,
      };
    case 'book':
      return {
        current: item.currentPage ?? 0,
        total: item.totalPages ?? 0,
        label: 'pages',
      };
    case 'movie':
      return {
        current: item.watchedMinutes ?? 0,
        total: item.totalEpisodes ?? 0,
        label: 'min',
      };
    default:
      return {
        current: item.currentEpisode ?? 0,
        total: item.totalEpisodes ?? 0,
        label: 'episodes',
      };
  }
};