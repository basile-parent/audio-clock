import { unstable_noStore as noStore } from "next/cache";
import fs from "node:fs/promises";
import path from "node:path";
import type { Audiobook } from "@/app/components/Audiobooks/types";

/** Fichiers servis statiquement depuis `public/audiobooks/`. */
const AUDIOBOOKS_DIR = path.join(process.cwd(), "public", "audiobooks");

function titleFromFilename(filename: string): string {
  return path.basename(filename, path.extname(filename));
}

export async function listAudiobooksFromDisk(): Promise<Audiobook[]> {
  noStore();

  let entries: string[];
  try {
    entries = await fs.readdir(AUDIOBOOKS_DIR);
  } catch {
    return [];
  }

  const mp3Files = entries.filter(
    (name) => /\.mp3$/i.test(name) && !name.startsWith("."),
  );
  mp3Files.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

  return mp3Files.map((filename) => ({
    id: filename,
    title: titleFromFilename(filename),
    author: "",
    duration: 0,
    progress: 0,
    isPlaying: false,
    audioUrl: `/audiobooks/${encodeURIComponent(filename)}`,
  }));
}
