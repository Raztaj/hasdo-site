import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { ORG } from '@/lib/site';
import Maintenance from './components/maintenance';

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
        <Maintenance />
      </body>
    </html>
  );
}
