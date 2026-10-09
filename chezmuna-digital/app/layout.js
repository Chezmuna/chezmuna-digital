import './globals.css';
import { Bricolage_Grotesque, Instrument_Sans, Instrument_Serif } from 'next/font/google';
import { getSite } from '@/lib/db';
import Reveal from '@/components/Reveal';
const fh = Bricolage_Grotesque({ subsets: ['latin'], variable: '--fh' });
const fb = Instrument_Sans({ subsets: ['latin'], variable: '--fb' });
const fs = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--fs' });
export const metadata = {
  metadataBase: new URL('https://chezmunadigital.com.ng'),
  title: { default: 'Chezmuna Digital | Membership portals and business platforms', template: '%s | Chezmuna Digital' },
  description: 'We design and build membership portals, business platforms and automation systems for associations, institutions, NGOs and growing companies in Nigeria.',
  openGraph: { siteName: 'Chezmuna Digital', type: 'website', locale: 'en_NG' },
};
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };
export default async function Layout({ children }) {
  const site = await getSite();
  return (
    <html lang="en" className={`${fh.variable} ${fb.variable} ${fs.variable}`}>
      <body>
        <header className="hd"><div className="wrap top">
          <a className="logo" href="/"><i>C</i>Chezmuna Digital</a>
          <nav><a className="h" href="/#services">Services</a><a className="h" href="/#work">Our work</a><a className="h" href="/#process">Process</a><a className="h" href="/blog">Insights</a><a className="btn sm" href="/quote">Get a quote</a></nav>
        </div></header>
        {children}
        <footer className="ft"><div className="wrap fg">
          <div><a className="logo" href="/"><i>C</i>Chezmuna Digital</a><p>Platforms, portals and automation for organisations that want to run on systems, not spreadsheets.</p></div>
          <div><h4>Explore</h4><a href="/#services">Services</a><a href="/#work">Our work</a><a href="/blog">Insights</a><a href="/quote">Get a quote</a></div>
          <div><h4>Contact</h4><a href={`mailto:${site.email}`}>{site.email}</a>{site.phone && <span>{site.phone}</span>}<span>{site.location}</span></div>
        </div>
        <div className="wrap fb2"><span>© {new Date().getFullYear()} Chezmuna Digital</span><span>A digital solutions venture of Chezmuna Enterprises</span></div></footer>
        <Reveal />
      </body>
    </html>
  );
}
