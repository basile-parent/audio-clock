import { listAudiobooksFromDisk } from "@/app/lib/audiobooks/listAudiobooks";
import { NextResponse } from "next/server";

/** Liste les MP3 de `public/audiobooks/` avec leur URL publique. */
export async function GET() {
  try {
    const audiobooks = await listAudiobooksFromDisk();
    return NextResponse.json(audiobooks);
  } catch {
    return NextResponse.json(
      { error: "Impossible de lister les audiobooks" },
      { status: 500 },
    );
  }
}
