import Banner from "@/components/Banner";
import ImpactStats from "@/components/ImpactStats";
import EventsSection from "@/components/EventsSection";
import OurGallery from "@/components/OurGallery";
import Subscribe from "@/components/Subscribe";

export default function Home() {
  return (
    <>
      <Banner />
      <ImpactStats />
      <EventsSection />
      <OurGallery />
      <Subscribe />
    </>
  );
}
