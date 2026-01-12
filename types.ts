
export interface Song {
  title: string;
  artist: string;
  origin: 'Korean' | 'International';
  description: string;
}

export interface RecommendationResponse {
  songs: Song[];
}
