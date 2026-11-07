import { Choreo, Cursor } from "@/components/Choreo";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Destination, Discover, Escape, Experience, Footer, Gallery, Plan, Stewardship, Villas } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Choreo />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Experience />
        <Villas />
        <Discover />
        <Gallery />
        <Destination />
        <Stewardship />
        <Plan />
        <Escape />
      </main>
      <Footer />
    </>
  );
}
