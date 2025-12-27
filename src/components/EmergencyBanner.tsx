'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

export default function EmergencyBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/emergency-settings');
        if (res.ok) {
          const data = await res.json();
          setShowBanner(data.enabled);
        }
      } catch (error) {
        console.error('Error fetching emergency settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading || !showBanner) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 text-white py-3 px-4 shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIzIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
      <div className="relative max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm animate-pulse">
            <Icon name="AlertCircle" size={20} />
          </div>
          <div className="text-center sm:text-left">
            <p className="font-bold text-base sm:text-lg">
              🚨 Emergency Repairs? Storm Damage?
            </p>
            <p className="text-sm text-white/90">
              We respond within <span className="font-bold">4 hours</span> • Available 24/7
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          href="/contact?emergency=true" 
          className="bg-white text-red-600 border-white hover:bg-red-50 font-bold whitespace-nowrap shadow-lg flex-shrink-0"
        >
          <Icon name="Phone" size={16} className="mr-2" />
          Call Now: (864) 724-4600
        </Button>
      </div>
    </div>
  );
}
