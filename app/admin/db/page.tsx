import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import AdminDbView from '@/components/admin/AdminDbView';

export const metadata = {
  title: 'DB // Poporroyo',
  robots: { index: false, follow: false },
};

export default function AdminDbPage() {
  return (
    <>
      <Navbar />
      <main>
        <AdminDbView />
      </main>
      <Footer />
    </>
  );
}
