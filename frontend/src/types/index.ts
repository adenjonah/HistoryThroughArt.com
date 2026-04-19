export interface SanityImage {
  hotspot?: { x: number; y: number };
  crop?: unknown;
  asset: unknown;
}

export interface Artwork {
  id: number;
  name: string;
  location: string;
  artist_culture: string;
  date: string;
  materials: string;
  unit: number;
  museum: string;
  displayedLocation: string;
  displayedLatitude?: number;
  displayedLongitude?: number;
  originatedLatitude?: number;
  originatedLongitude?: number;
  image: string[];
  imageData: SanityImage[];
  videoLink: string[] | null;
  transcript: string[] | null;
}

export interface DueDate {
  id: string;
  type: string;
  title: string;
  dueDate: string;
  notes?: string;
}

export interface DueDatesData {
  assignments: Array<{ id: string; dueDate: string }>;
  quizzes: Array<{ title: string; dueDate: string }>;
}
