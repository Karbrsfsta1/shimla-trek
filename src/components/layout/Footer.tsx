import { Link } from 'react-router-dom';
import { Mountain, Facebook, Instagram, Twitter } from 'lucide-react';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/treks', label: 'Treks' },
  { to: '/homestays', label: 'Homestays' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const legalLinks = [
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/refund-policy', label: 'Refund Policy' },
  { to: '/terms', label: 'Terms of Service' },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold text-white">
              <Mountain className="h-7 w-7" />
              <span>ShimlaTrek</span>
            </div>
            <p className="mt-3 text-sm text-gray-400">Discover the Himalayas with us</p>
            <div className="mt-4 space-y-1 text-sm text-gray-400">
              <a href="mailto:kforkartikbforbhardwaj@gmail.com" className="block hover:text-white transition-colors focus:outline-none focus-visible:text-white focus-visible:underline">
                kforkartikbforbhardwaj@gmail.com
              </a>
              <a href="https://wa.me/917876803910" target="_blank" rel="noreferrer" className="block hover:text-white transition-colors focus:outline-none focus-visible:text-white focus-visible:underline">
                +91 78768 03910
              </a>
            </div>
            <div className="mt-4 flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus-visible:text-white focus-visible:underline"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus-visible:text-white focus-visible:underline"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus-visible:text-white focus-visible:underline"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-white transition-colors focus:outline-none focus-visible:text-white focus-visible:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Legal</h3>
            <ul className="mt-4 space-y-2">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-white transition-colors focus:outline-none focus-visible:text-white focus-visible:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          &copy; 2026 ShimlaTrek. Made with care in Shimla, Himachal Pradesh.
        </div>
      </div>
    </footer>
  );
}
