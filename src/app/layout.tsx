import './globals.css';
import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { UtilBar } from '@/components/UtilBar';

export const metadata: Metadata = {
  title: 'Mosaic Policy Portal',
  description: 'Every policy. Every procedure. One database, plain English.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UtilBar />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
