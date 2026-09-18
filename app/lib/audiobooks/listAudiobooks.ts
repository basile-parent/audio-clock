import { unstable_noStore as noStore } from "next/cache";
import fs from "node:fs/promises";
import path from "node:path";
import type { Audiobook } from "@/app/components/Audiobooks/types";

/** Fichiers servis statiquement depuis `public/audiobooks/`. */
const AUDIOBOOKS_DIR = path.join(process.cwd(), "public", "audiobooks");

function titleFromFilename(filename: string): string {
  return path.basename(filename, path.extname(filename));
}

function getJSONFilename(filename: string): string {
  return path.basename(filename, path.extname(filename)) + ".json";
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

  return Promise.all(mp3Files.map(async (filename) => {
    let json = null;

    try {
      const jsonContent = await fs.readFile(path.join(AUDIOBOOKS_DIR, getJSONFilename(filename)), "utf8");
      json = JSON.parse(jsonContent);
    } catch (error) {
      console.error(`Error parsing JSON file ${filename}:`, error);
    }
    
    const displayTitle = json?.title ? `${json.title}${json.author ? ` - ${json.author}` : ""}` : titleFromFilename(filename);
    return {
      id: filename,
      title: json?.title ?? titleFromFilename(filename),
      author: json?.author,
      displayTitle,
      shortDescription: json?.shortDescription,
      duration: 0,
      progress: 0,
      isPlaying: false,
      audioUrl: `/audiobooks/${encodeURIComponent(filename)}`,
    }
  }));

}
