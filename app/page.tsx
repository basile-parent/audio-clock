import Actions from "./components/Actions/Actions";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer";
import Audiobooks from "./components/Audiobooks/Audiobooks";
import Clock from "./components/Clock/Clock";
import Weather from "./components/Weather/Weather";

export default function Home() {
  return (
    <main className="flex flex-row h-full items-center justify-center relative">
      <div className="flex-1 flex flex-col h-full items-center justify-center">
        <section id="audio-player" className="audio-player">
          <AudioPlayer />
        </section>
        <section id="clock" className="w-full flex-1 flex flex-col items-center justify-center">
          <Clock />
        </section>
        <section id="weather" className="w-full h-[250px] flex items-end">
          <Weather />
        </section>
      </div>
      <section id="actions" className="h-full w-[120px]">
        <Actions />
      </section>

      <section id="audiobooks">
        <Audiobooks />
      </section>
    </main>
  );
}
