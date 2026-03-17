import Actions from "./components/Actions/Actions";
import Clock from "./components/Clock/Clock";
import Weather from "./components/Weather/Weather";

export default function Home() {
  return (
    <main className="flex flex-row h-full items-center justify-center">
      <div className="flex-1 flex flex-col h-full items-center justify-center">
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
    </main>
  );
}
