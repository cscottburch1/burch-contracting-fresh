import React from 'react';
import { Icon } from '../ui/Icon';
import { Logo } from '../ui/Logo';
import { businessConfig } from '@/config/business';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="mb-6">
              <Logo variant="footer" />
            </div>
            <p className="text-gray-400 mb-4">{businessConfig.description}</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2">
                <Icon name="Phone" size={18} className="mt-1" />
                <a href={`tel:${businessConfig.contact.phone}`} className="hover:text-white">
                  {businessConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Mail" size={18} className="mt-1" />
                <a href={`mailto:${businessConfig.contact.email}`} className="hover:text-white">
                  {businessConfig.contact.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Hours</h4>
            <p className="text-gray-400 whitespace-pre-line">{businessConfig.contact.hours}</p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <a 
                href="https://www.bbb.org/us/sc/gray-court/profile/home-additions/burch-contracting-llc-0673-90007875"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <div className="bg-blue-900 text-white rounded w-8 h-8 flex items-center justify-center font-bold text-xs">
                  A+
                </div>
                <span className="text-sm">BBB A+ Rated</span>
              </a>
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm">5.0 Google Rating</span>
              </div>
              <span className="text-sm text-gray-400">30 Years in Business</span>
            </div>
            <p className="text-gray-400 text-sm">
              © {currentYear} {businessConfig.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
