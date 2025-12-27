'use client';

import React, { useState } from 'react';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { businessConfig } from '@/config/business';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Subcontractors', href: '/subcontractors/join' },
    { label: 'Customer Portal', href: '/portal' },
    { label: 'Contact', href: '/contact' },
    { label: 'Admin', href: '/admin' }
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="bg-gray-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <a href={`tel:${businessConfig.contact.phone}`} className="flex items-center gap-2">
              <Icon name="Phone" size={16} />
              <span>{businessConfig.contact.phone}</span>
            </a>
            <span className="hidden sm:inline">{businessConfig.serviceArea.description}</span>
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Logo variant="header" />

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-gray-700 hover:text-blue-600 font-medium">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Button variant="primary" size="sm" href="/contact">
              Free Estimate
            </Button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2">
            <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={24} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-gray-700 py-2">
                  {link.label}
                </a>
              ))}
              <Button variant="primary" size="md" href="/contact" fullWidth>
                Free Estimate
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
