import './globals.css';
import { Bricolage_Grotesque, Instrument_Sans, Instrument_Serif } from 'next/font/google';
import { getSite } from '@/lib/db';
import Reveal from '@/components/Reveal';
const fh = Bricolage_Grotesque({ subsets: ['latin'], variable: '--fh' });
const fb = Instrument_Sans({ subsets: ['latin'], variable: '--fb' });
const fs = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--fs' });
const BASE = 'https://chezmunadigital.com.ng';
const DESC = 'Chezmuna Digital designs and builds membership portals, custom business platforms and automation systems for associations, NGOs, schools and companies in Nigeria.';
export const metadata = {
  metadataBase: new URL(BASE),
  title: { default: 'Membership Portals & Business Platforms in Nigeria | Chezmuna Digital', template: '%s | Chezmuna Digital' },
  description: DESC,
  applicationName: 'Chezmuna Digital',
  icons: { icon: [{ url: '/favicon.ico', sizes: '48x48' }, { url: '/icon.svg', type: 'image/svg+xml' }], apple: '/apple-icon.png' },
  keywords: ['membership portal development Nigeria', 'business platform development Lagos', 'association management software', 'church management system', 'NGO digital platform', 'business automation Nigeria', 'custom web application Lagos'],
  openGraph: { siteName: 'Chezmuna Digital', type: 'website', locale: 'en_NG', url: BASE, title: 'Membership Portals & Business Platforms in Nigeria | Chezmuna Digital', description: DESC },
  twitter: { card: 'summary_large_image', title: 'Chezmuna Digital', description: DESC },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#0b2e22' };
export default async function Layout({ children }) {
  const site = await getSite();
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': BASE + '/#org', name: 'Chezmuna Digital', url: BASE, logo: BASE + '/apple-icon.png', description: DESC, email: site.email, ...(site.phone ? { telephone: site.phone } : {}),
        address: { '@type': 'PostalAddress', addressLocality: String(site.location).split(',')[0].trim(), addressCountry: 'NG' }, areaServed: { '@type': 'Country', name: 'Nigeria' },
        parentOrganization: { '@type': 'Organization', name: 'Chezmuna Enterprises' },
        knowsAbout: ['Membership portals', 'Business web applications', 'Business process automation', 'CRM and ERP integration'] },
      { '@type': 'WebSite', '@id': BASE + '/#website', url: BASE, name: 'Chezmuna Digital', publisher: { '@id': BASE + '/#org' }, inLanguage: 'en-NG' },
    ],
  };
  return (
    <html lang="en-NG" className={`${fh.variable} ${fb.variable} ${fs.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
        <header className="hd"><div className="wrap top">
          <a className="logo" href="/"><i>C</i>Chezmuna Digital</a>
          <nav aria-label="Main"><a className="h" href="/#services">Services</a><a className="h" href="/#work">Our work</a><a className="h" href="/#process">Process</a><a className="h" href="/blog">Insights</a><a className="btn sm" href="/quote">Get a quote</a></nav>
        </div></header>
        {children}
        <footer className="ft"><div className="wrap fg">
          <div><a className="logo" href="/"><i>C</i>Chezmuna Digital</a><p>Platforms, portals and automation for organisations that want to run on systems, not spreadsheets.</p></div>
          <nav aria-label="Footer"><h4>Explore</h4><a href="/#services">Services</a><a href="/#work">Our work</a><a href="/blog">Insights</a><a href="/quote">Get a quote</a></nav>
          <div><h4>Contact</h4><a href={`mailto:${site.email}`}>{site.email}</a>{site.phone && <span>{site.phone}</span>}<span>{site.location}</span></div>
        </div>
        <div className="wrap fb2"><span>© {new Date().getFullYear()} Chezmuna Digital</span><span>A digital solutions venture of Chezmuna Enterprises</span></div></footer>
        <Reveal />
      </body>
    </html>
  );
}
