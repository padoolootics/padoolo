'use client';

import hfSettingServices from '@/lib/api/services/headerFooterSettings';
import { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';


type MarqueItem = {
  label: string;
};

export default function TopMarquee() {
  const [marque, setMarque] = useState<MarqueItem[]>([]);

  useEffect(() => {
    hfSettingServices
      .getHFSettings()
      .then((data) => {
        if (Array.isArray(data?.marque)) {
          setMarque(data.marque);
        }
      })
      .catch((err) => {
        console.error('Failed to load marquee data', err);
      });
  }, []);

  if (!marque.length) return null;

  return (
    <div className="bg-[#0a2a4a] text-white text-sm font-semibold py-2">
      <Marquee pauseOnHover gradient={false} speed={50}>
        <div className="flex items-center space-x-6">
          {marque.map((item, index) => (
            <div key={index} className="flex items-center space-x-6">
              <span
                className={
                  index % 2 === 1 ? 'text-yellow-400' : 'text-white'
                }
              >
                {item.label}
              </span>

              {/* Separator (skip after last item) */}
              {index !== marque.length - 1 && (
                <span className="text-white">---</span>
              )}
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  );
}
