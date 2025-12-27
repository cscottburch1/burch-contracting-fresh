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

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} {businessConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
