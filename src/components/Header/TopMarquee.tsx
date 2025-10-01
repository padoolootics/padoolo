// components/TopMarquee.tsx
'use client';

import Marquee from 'react-fast-marquee';

export default function TopMarquee() {
  return (
    <div className="bg-[#0a2a4a] text-white text-sm font-semibold py-2">
      <Marquee pauseOnHover gradient={false} speed={50}>
        <div className="flex items-center space-x-6">
          <span className="text-white"> NEW CUSTOMERS SAVE 10% WITH CODE <strong>GET10 </strong></span>
          <span className="text-white">---</span>
          <span className="text-yellow-400"> FREE SHIPPING ON ALL ORDERS OVER $50 </span>
          <span className="text-white">---</span>
          <span className="text-white"> 15% OFF ON BRIDAL SHOES </span>
          <span className="text-white">---</span>
          <span className="text-yellow-400"> 7 DAYS FREE RETURN </span>
          <span className="text-white">---</span>
          <span className="text-white"> NEW CUSTOMERS SAVE 10% WITH CODE <strong>GET10 </strong></span>
          <span className="text-white">---</span>
          <span className="text-yellow-400"> FREE SHIPPING ON ALL ORDERS OVER $50 </span>
          <span className="text-white">---</span>
          <span className="text-white"> 15% OFF ON BRIDAL SHOES </span>
          <span className="text-white">---</span>
          <span className="text-yellow-400"> 7 DAYS FREE RETURN </span>
          <span className="text-white">---</span>
        </div>
      </Marquee>
    </div>
  );
}
