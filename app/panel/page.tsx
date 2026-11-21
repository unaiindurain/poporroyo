import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import PanelView from '@/components/panel/PanelView';

export const metadata = {
  title: 'PANEL // Poporroyo',
};

export default function PanelPage() {
  return (
    <>
      <Navbar />
      <main>
        <PanelView />
      </main>
      <Footer />
    </>
  );
}
