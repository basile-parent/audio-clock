export type Audiobook = {
  id: string;
  title: string;
  author: string;
  duration: number;
  progress: number;
  isPlaying: boolean;
  /** URL publique (fichier dans `public/audiobooks/`) */
  audioUrl: string;
};
