import Constants from 'expo-constants';
import { MediaType } from '../types';

let TMDB_API_KEY = process.env.TMDB_API_KEY ?? '';
let RAWG_API_KEY = process.env.RAWG_API_KEY ?? '';

try {
  const keys = require('./keys');
  if (keys.TMDB_KEY) TMDB_API_KEY = keys.TMDB_KEY;
  if (keys.RAWG_KEY) RAWG_API_KEY = keys.RAWG_KEY;
} catch {}

async function searchTMDB(title: string, type: 'movie' | 'tv'): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&language=pt-BR`
    );
    const data = await res.json();
    const result = data.results?.[0];
    if (result?.poster_path) {
      return `https://image.tmdb.org/t/p/w500${result.poster_path}`;
    }
    return null;
  } catch {
    return null;
  }
}

async function searchOpenLibrary(title: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=1`
    );
    const data = await res.json();
    const coverId = data.docs?.[0]?.cover_i;
    if (coverId) {
      return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
    }
    return null;
  } catch {
    return null;
  }
}

async function searchRAWG(title: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(title)}&page_size=1`
    );
    const data = await res.json();
    const result = data.results?.[0];
    return result?.background_image ?? null;
  } catch {
    return null;
  }
}

async function searchJikan(title: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`
    );
    const data = await res.json();
    return data.data?.[0]?.images?.jpg?.large_image_url ?? null;
  } catch {
    return null;
  }
}

async function searchJikanManga(title: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(title)}&limit=1`
    );
    const data = await res.json();
    return data.data?.[0]?.images?.jpg?.large_image_url ?? null;
  } catch {
    return null;
  }
}

export async function fetchCoverUrl(title: string, type: MediaType): Promise<string | null> {
  switch (type) {
    case 'movie':
      return searchTMDB(title, 'movie');
    case 'series':
      return searchTMDB(title, 'tv');
    case 'anime':
      return searchJikan(title);
    case 'manga':
      return searchJikanManga(title);
    case 'book':
    case 'lightnovel':
      return searchOpenLibrary(title);
    case 'game':
      return searchRAWG(title);
    default:
      return null;
  }
}