import { Hero } from "@/components/Hero";
import { Timeline } from "@/components/Timeline";
import { Gallery } from "@/components/Gallery";
import { ThingsILove } from "@/components/ThingsILove";
import { Counter } from "@/components/Counter";
import { Vinyl } from "@/components/Vinyl";
import { Letter } from "@/components/Letter";
import { DateVoucher } from "@/components/DateVoucher";

export default function Home() {
  return (
    <main>
      <Hero />
      <Timeline />
      <Gallery />
      <ThingsILove />
      <Counter />
      <Vinyl />
      <Letter />
      <DateVoucher />
    </main>
  );
}
