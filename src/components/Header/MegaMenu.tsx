import Link from 'next/link';

const categories = ['Sunglasses', 'Watches', 'Clothing', 'Shoes', 'Brands'];

export default function DesktopNav() {
  return (
    <div className="hidden lg:flex lg:gap-x-4">
      <Link href="/" prefetch={true} className="text-base font-medium text-gray-900">
        Home
      </Link>

      {/* {categories.map((category) => (
        <HoverPopover key={category} label={category} />
      ))} */}

      <Link href="/sunglasses" className="text-base font-medium text-gray-900" prefetch={true}  >
        Sunglasses
      </Link>
      <Link href="/new-arrivals" className="text-base font-medium text-gray-900" prefetch={true}  >
        New Arrivals
      </Link>
      <Link href="/clothing" className="text-base font-medium text-gray-900" prefetch={true}  >
        Clothing
      </Link>
      <Link href="/eyeglasses" className="text-base font-medium text-gray-900" prefetch={true}  >
        Eyeglasses
      </Link>
      <Link href="/spotlight-deals" className="text-base font-medium text-gray-900" prefetch={true}  >
        Spotlight Deals
      </Link>
      
    </div>
  );
}