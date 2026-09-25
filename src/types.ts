export interface PhotoItem {
  id: string;
  url: string;
  title: string;
}

export interface TimelineCard {
  id: string;
  yearTitle: string;
  caption: string;
  photos: PhotoItem[];
}

export interface AppState {
  letter: string;
  timeline: TimelineCard[];
  weddingDate: string;
}
