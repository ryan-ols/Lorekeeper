import * as SQLite from 'expo-sqlite';
import { MediaItem } from '../types';

const db = SQLite.openDatabaseSync('catalog.db');

export function setupDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      coverUri TEXT,
      totalEpisodes INTEGER,
      currentEpisode INTEGER,
      totalVolumes INTEGER,
      currentVolume INTEGER,
      chaptersInCurrentVolume INTEGER,
      currentChapterInVolume INTEGER,
      totalSeasons INTEGER,
      currentSeason INTEGER,
      episodesInCurrentSeason INTEGER,
      currentEpisodeInSeason INTEGER,
      totalPages INTEGER,
      currentPage INTEGER,
      totalChapters INTEGER,
      currentChapter INTEGER,
      watchedMinutes INTEGER,
      season INTEGER,
      startedAt TEXT,
      finishedAt TEXT,
      notes TEXT,
      rating REAL,
      platform TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

  const columns = db.getAllSync<{ name: string }>(`PRAGMA table_info(media)`).map(c => c.name);

  const newColumns: { name: string; type: string }[] = [
    { name: 'chaptersInCurrentVolume', type: 'INTEGER' },
    { name: 'currentChapterInVolume', type: 'INTEGER' },
    { name: 'totalSeasons', type: 'INTEGER' },
    { name: 'currentSeason', type: 'INTEGER' },
    { name: 'episodesInCurrentSeason', type: 'INTEGER' },
    { name: 'currentEpisodeInSeason', type: 'INTEGER' },
    { name: 'totalPages', type: 'INTEGER' },
    { name: 'currentPage', type: 'INTEGER' },
    { name: 'totalChapters', type: 'INTEGER' },
    { name: 'currentChapter', type: 'INTEGER' },
    { name: 'watchedMinutes', type: 'INTEGER' },
  ];

  for (const col of newColumns) {
    if (!columns.includes(col.name)) {
      db.execSync(`ALTER TABLE media ADD COLUMN ${col.name} ${col.type};`);
    }
  }
}

export function getAllMedia(): MediaItem[] {
  return db.getAllSync<MediaItem>('SELECT * FROM media ORDER BY updatedAt DESC');
}

export function getMediaById(id: string): MediaItem | null {
  return db.getFirstSync<MediaItem>('SELECT * FROM media WHERE id = ?', [id]) ?? null;
}

export function insertMedia(item: MediaItem): void {
  db.runSync(
    `INSERT INTO media (
      id, title, author, type, status, coverUri,
      totalEpisodes, currentEpisode,
      totalVolumes, currentVolume,
      chaptersInCurrentVolume, currentChapterInVolume,
      totalSeasons, currentSeason,
      episodesInCurrentSeason, currentEpisodeInSeason,
      totalPages, currentPage,
      totalChapters, currentChapter,
      watchedMinutes, season,
      startedAt, finishedAt, notes, rating, platform,
      createdAt, updatedAt
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?,
      ?, ?,
      ?, ?,
      ?, ?,
      ?, ?,
      ?, ?,
      ?, ?,
      ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?
    )`,
    [
      item.id, item.title, item.author ?? null, item.type, item.status, item.coverUri ?? null,
      item.totalEpisodes ?? null, item.currentEpisode ?? null,
      item.totalVolumes ?? null, item.currentVolume ?? null,
      item.chaptersInCurrentVolume ?? null, item.currentChapterInVolume ?? null,
      item.totalSeasons ?? null, item.currentSeason ?? null,
      item.episodesInCurrentSeason ?? null, item.currentEpisodeInSeason ?? null,
      item.totalPages ?? null, item.currentPage ?? null,
      item.totalChapters ?? null, item.currentChapter ?? null,
      item.watchedMinutes ?? null, item.season ?? null,
      item.startedAt ?? null, item.finishedAt ?? null, item.notes ?? null,
      item.rating ?? null, item.platform ?? null,
      item.createdAt, item.updatedAt,
    ]
  );
}

export function updateMedia(item: MediaItem): void {
  db.runSync(
    `UPDATE media SET
      title = ?, author = ?, type = ?, status = ?, coverUri = ?,
      totalEpisodes = ?, currentEpisode = ?,
      totalVolumes = ?, currentVolume = ?,
      chaptersInCurrentVolume = ?, currentChapterInVolume = ?,
      totalSeasons = ?, currentSeason = ?,
      episodesInCurrentSeason = ?, currentEpisodeInSeason = ?,
      totalPages = ?, currentPage = ?,
      totalChapters = ?, currentChapter = ?,
      watchedMinutes = ?, season = ?,
      startedAt = ?, finishedAt = ?, notes = ?, rating = ?,
      platform = ?, updatedAt = ?
    WHERE id = ?`,
    [
      item.title, item.author ?? null, item.type, item.status, item.coverUri ?? null,
      item.totalEpisodes ?? null, item.currentEpisode ?? null,
      item.totalVolumes ?? null, item.currentVolume ?? null,
      item.chaptersInCurrentVolume ?? null, item.currentChapterInVolume ?? null,
      item.totalSeasons ?? null, item.currentSeason ?? null,
      item.episodesInCurrentSeason ?? null, item.currentEpisodeInSeason ?? null,
      item.totalPages ?? null, item.currentPage ?? null,
      item.totalChapters ?? null, item.currentChapter ?? null,
      item.watchedMinutes ?? null, item.season ?? null,
      item.startedAt ?? null, item.finishedAt ?? null, item.notes ?? null,
      item.rating ?? null, item.platform ?? null,
      item.updatedAt, item.id,
    ]
  );
}

export function deleteMedia(id: string): void {
  db.runSync('DELETE FROM media WHERE id = ?', [id]);
}