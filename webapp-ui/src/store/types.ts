export interface Song {
  id: string;
  title: string;
  song?: string; // URL to the song file
  thumbnail?: string; // URL to the thumbnail
  duration?: number;
  cityName?: string;
  stateName?: string;
  country?: string;
  uploadedBy?: number;
  live?: boolean;
  bandId?: string;
  albumId?: string;
  createdAt?: string;
  updatedAt?: string;
  hashValue?: string;
  latitude?: number;
  longitude?: number;
  promotedSong?: 'CITY' | 'STATE' | 'NATIONAL';
  airedOn?: string;
  promotedToStateDate?: string;
  promotedToNationalDate?: string;
  deletedAt?: string;
}

export interface Band {
  id: string;
  title?: string; // Changed from 'name' to 'title' to match backend
  description?: string;
  genre?: string;
  members?: User[];
  songs?: Song[]; // Add songs array
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  role: {
    id: number;
    name: string;
  };
  band?: Band;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

export interface CredentialsPayload {
  user: User;
  accessToken: string;
}

export interface BandState {
  data: any | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
} 