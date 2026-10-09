import './globals.css';
import { Bricolage_Grotesque, Instrument_Sans } from 'next/font/google';
const fh = Bricolage_Grotesque({ subsets: ['latin'], variable: '--fh' });
const fb = Instrument_Sans({ subsets: ['latin'], variable: '--fb' });
export const metadata = {
  title: { default: 'Chezmuna Digital | Membership portals and business platforms', template: '%s | Chezmuna Digital' },
  description: 'We design and build membership portals, business platforms and automation systems for associations, institutions, NGOs and growing companies.',
};
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };
export default function Layout({ children }) {
  return (
    <html lang="en" className={`${fh.variable} ${fb.variable}`}>
      <body>
        <div className="wrap top">
          <a className="logo" href="/">Chezmuna Digital</a>
          <nav><a className="h" href="/#services">Services</a><a className="h" href="/#work">Our work</a><a className="h" href="/blog">Insights</a><a className="btn" href="/quote">Get a quote</a></nav>
        </div>
        {children}
        <footer><div className="wrap"><span>© Chezmuna Digital</span><span>A digital solutions venture of Chezmuna Enterprises, Lagos, Nigeria</span></div></footer>
      </body>
    </html>
  );
}
