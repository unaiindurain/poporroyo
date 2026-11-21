import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import RuletaView from '@/components/ruleta/RuletaView';

export const metadata = {
  title: 'RULETA // Poporroyo',
};

export default function RuletaPage() {
  return (
    <>
      <Navbar />
      <main>
        <RuletaView />
      </main>
      <Footer />
    </>
  );
}
