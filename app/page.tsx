import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import NetworkSection from '@/components/landing/NetworkSection';
import PlayerSection from '@/components/landing/PlayerSection';
import ClipsSection from '@/components/landing/ClipsSection';
import ScheduleSection from '@/components/landing/ScheduleSection';
import BusinessSection from '@/components/landing/BusinessSection';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <NetworkSection />
        <PlayerSection />
        <ClipsSection />
        <ScheduleSection />
        <BusinessSection />
      </main>
      <Footer />
    </>
  );
}
