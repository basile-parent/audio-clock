export type Audiobook = {
  id: string;
  title: string;
  author: string;
  displayTitle: string;
  shortDescription: string;
  duration: number;
  progress: number;
  isPlaying: boolean;
  /** URL publique (fichier dans `public/audiobooks/`) */
  audioUrl: string;
};

export type AudiobookJSON = {
  title: string;
  author: string;
  shortDescription: string;
};
