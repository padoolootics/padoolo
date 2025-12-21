'use client';

import { useEffect, useState } from 'react';
import hfSettingServices, { HFMenuItem } from '@/lib/api/services/headerFooterSettings';
import Link from 'next/link';

export const FALLBACK_HEADER_MENU = [
  { label: 'Home', url: '/', target: '_self' },
  { label: 'Sunglasses', url: '/sunglasses', target: '_self' },
  { label: 'New Arrivals', url: '/new-arrivals', target: '_self' },
  { label: 'Clothing', url: '/clothing', target: '_self' },
  { label: 'Eyeglasses', url: '/eyeglasses', target: '_self' },
  { label: 'Spotlight Deals', url: '/spotlight-deals', target: '_self' },
];

export default function DesktopNav() {
  const [menu, setMenu] = useState<any[]>(FALLBACK_HEADER_MENU);

  useEffect(() => {
    hfSettingServices.getHFSettings().then((data) => {
      if (data?.header_menu?.length) {
        setMenu(data.header_menu);
      }
    });
  }, []);

  return (
    <div className="hidden lg:flex lg:gap-x-4">
      {menu.map((item) => (
        <Link
          key={item.label}
          href={item.url}
          prefetch
          className="text-base font-medium text-gray-900"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}



// import hfSettingServices from '@/lib/api/services/headerFooterSettings';
// import Link from 'next/link';

// const categories = ['Sunglasses', 'Watches', 'Clothing', 'Shoes', 'Brands'];

// export default function DesktopNav() {

//   // const hfSettings = await hfSettingServices.getHFSettings();

//   // console.log('hfSettings', hfSettings);
  
//   return (
//     <div className="hidden lg:flex lg:gap-x-4">
//       <Link href="/" prefetch={true} className="text-base font-medium text-gray-900">
//         Home
//       </Link>

//       {/* {categories.map((category) => (
//         <HoverPopover key={category} label={category} />
//       ))} */}

//       <Link href="/sunglasses" className="text-base font-medium text-gray-900" prefetch={true}  >
//         Sunglasses
//       </Link>
//       <Link href="/new-arrivals" className="text-base font-medium text-gray-900" prefetch={true}  >
//         New Arrivals
//       </Link>
//       <Link href="/clothing" className="text-base font-medium text-gray-900" prefetch={true}  >
//         Clothing
//       </Link>
//       <Link href="/eyeglasses" className="text-base font-medium text-gray-900" prefetch={true}  >
//         Eyeglasses
//       </Link>
//       <Link href="/spotlight-deals" className="text-base font-medium text-gray-900" prefetch={true}  >
//         Spotlight Deals
//       </Link>
      
//     </div>
//   );
// }