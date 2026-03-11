import Image from "next/image";
import Clock from "./components/Clock/Clock";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <section id="clock">
        <Clock />
      </section>
    </main>
  );
}
