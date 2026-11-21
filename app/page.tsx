import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import NetworkSection from '@/components/landing/NetworkSection';
import PlayerSection from '@/components/landing/PlayerSection';
import ClipsSection from '@/components/landing/ClipsSection';
import ScheduleSection from '@/components/landing/ScheduleSection';
import WinnersSection from '@/components/landing/WinnersSection';
import BusinessSection from '@/components/landing/BusinessSection';
import Footer from '@/components/landing/Footer';

// La sección de ganadores lee la base de datos; revalida cada minuto para
// que un nuevo ganador aparezca sin necesidad de un redeploy.
export const revalidate = 60;

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
        <WinnersSection />
        <BusinessSection />
      </main>
      <Footer />
    </>
  );
}
