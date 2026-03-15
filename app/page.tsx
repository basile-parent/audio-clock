import Clock from "./components/Clock/Clock";
import Weather from "./components/Weather/Weather";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center">
      <section id="clock" className="w-1/1 flex-4 flex flex-col items-center justify-center">
        <Clock />
      </section>
      <section id="weather" className="w-1/1 flex-1 flex items-end">
        <Weather />
      </section>
    </main>
  );
}
