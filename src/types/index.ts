export type MediaType = 'book' | 'series' | 'movie' | 'anime' | 'manga' | 'game' | 'lightnovel' | 'other';

export type StatusType = 'watching' | 'reading' | 'playing' | 'completed' | 'paused' | 'dropped' | 'plan';

export interface MediaItem {
  id: string;
  title: string;
  author?: string;      
  type: MediaType;
  status: StatusType;
  coverUri?: string;     
  totalEpisodes?: number; 
  currentEpisode?: number;
  totalVolumes?: number;
  currentVolume?: number;
  season?: number;
  startedAt?: string;    
  finishedAt?: string;
  notes?: string;
  rating?: number;        
  platform?: string;     
  createdAt: string;
  updatedAt: string;
}