export enum Side {
  Left,
  Right,
}

export enum Phase {
  Input,
  Game,
  Results,
}

export enum StreamingService {
  Youtube, 
  Spotify, 
  AppleMusic
}

export interface SongData {
    title: string,
    videoId: string,
    type: StreamingService
}