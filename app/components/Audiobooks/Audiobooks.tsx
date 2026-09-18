import AudiobooksRender from "./AudiobooksRender";
import { listAudiobooksFromDisk } from "@/app/lib/audiobooks/listAudiobooks";

const Audiobooks = async () => {
  const audiobooks = await listAudiobooksFromDisk();

  return <AudiobooksRender audiobooks={audiobooks} />;
};

export default Audiobooks;
