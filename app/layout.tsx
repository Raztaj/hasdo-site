import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { ORG } from '@/lib/site';
import Header from './components/header';
import Footer from './components/footer';

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: ORG.nameAr,
    template: `%s · ${ORG.acronym}`,
  },
  description: ORG.blurb,
  applicationName: ORG.acronym,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={ibmPlexSansArabic.variable}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
