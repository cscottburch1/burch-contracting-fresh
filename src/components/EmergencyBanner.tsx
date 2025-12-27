'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

interface Banner {
  id: number;
  title: string;
  message: string;
  button_text: string | null;
  button_link: string | null;
  bg_color: string;
  text_color: string;
  icon: string | null;
}

export default function DynamicBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch('/api/banners/active');
        if (res.ok) {
          const data = await res.json();
          setBanners(data.banners || []);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading || banners.length === 0) {
    return null;
  }

  return (
    <>
      {banners.map((banner) => (
        <div key={banner.id} className={`bg-gradient-to-r ${banner.bg_color} text-${banner.text_color} py-3 px-4 shadow-lg relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIzIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
          <div className="relative max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {banner.icon && (
                <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm animate-pulse">
                  <Icon name={banner.icon as any} size={20} />
                </div>
              )}
              <div className="text-center sm:text-left">
                <p className="font-bold text-base sm:text-lg">
                  {banner.title}
                </p>
                <p className="text-sm opacity-90">
                  {banner.message}
                </p>
              </div>
            </div>
            {banner.button_text && banner.button_link && (
              <Button 
                variant="outline" 
                size="sm" 
                href={banner.button_link}
                className="bg-white text-gray-900 border-white hover:bg-gray-100 font-bold whitespace-nowrap shadow-lg flex-shrink-0"
              >
                {banner.button_text}
              </Button>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
