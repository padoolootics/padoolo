"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import AvatarDropdown from "./AvatarDropdown";
import CartDropdown from "./CartDropDown";
import Wishlist from "./Wishlist";
import Topbar from "./Topbar";
import Marquee from "./TopMarquee";
import { useAuth } from "@/lib/Contexts/AuthContext";
import MegaMenu from "./MegaMenu";
import SearchFilter from "./SearchFilter";
import { usePathname } from "next/navigation";

const products = [
  {
    name: "Analytics",
    description: "Get a better understanding of your traffic",
    href: "#",
    icon: ChartPieIcon,
  },
  {
    name: "Engagement",
    description: "Speak directly to your customers",
    href: "#",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Security",
    description: "Your customers’ data will be safe and secure",
    href: "#",
    icon: FingerPrintIcon,
  },
  {
    name: "Integrations",
    description: "Connect with third-party tools",
    href: "#",
    icon: SquaresPlusIcon,
  },
  {
    name: "Automations",
    description: "Build strategic funnels that will convert",
    href: "#",
    icon: ArrowPathIcon,
  },
];
const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "#", icon: PhoneIcon },
];

export default function MainNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  
  const pathName = usePathname();

  useEffect(() => {
  setMobileMenuOpen(false);
}, [pathName]);

  return (
    <>
      <Topbar />
      <header className="bg-white border-b border-gray-900/10 sticky top-0 z-50">
        <div className="container mx-auto">
          <nav
            aria-label="Global"
            className="flex flex-wrap items-center justify-between gap-4 p-4"
          >
            {/* Logo + Mobile Menu Button */}
            <div className="flex items-center justify-between w-full lg:w-auto">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center">
                <Image
                  alt="Padoolo Logo"
                  src="/padoolo1.png"
                  className="h-auto w-20"
                  width={96}
                  height={62}
                />
              </Link>

              <div className="flex lg:hidden gap-4">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>
                {/* <CartDropdown /> */}
                {!(pathName.startsWith('/cart') || pathName.startsWith('/checkout')) && <CartDropdown />}
                {isAuthenticated && <AvatarDropdown />}
              </div>
            </div>

            {/* Desktop Nav Links */}
            {/* <PopoverGroup className="hidden lg:flex lg:gap-x-8">
              <Link href="#" className="text-base font-medium text-gray-900">
                Home
              </Link>
              {["Sunglasses", "Watches", "Clothing", "Shoes", "Brands"].map((category) => (
                <Popover key={category} className="relative">
                  <PopoverButton className="flex items-center gap-x-1 text-base font-medium text-gray-900 outline-none">
                    {category}
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  </PopoverButton>
                  <PopoverPanel className="absolute top-full z-10 mt-3 w-56 rounded-xl bg-white shadow-lg ring-1 ring-gray-200">
                    <div className="p-4 text-sm text-gray-600">
                      Placeholder for {category}
                    </div>
                  </PopoverPanel>
                </Popover>
              ))}
              <Link href="#" className="text-base font-medium text-gray-900">
                Sales
              </Link>
            </PopoverGroup> */}

            <MegaMenu />

            {/* Search + Icons */}
            <div className="hidden lg:flex items-center gap-x-4 ml-auto">
              {/* <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search products"
                  className="w-full rounded-md border border-gray-300 pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div> */}

              {/* <UserIcon className="h-6 w-6 text-gray-600" /> */}
              <SearchFilter />
              <Wishlist />
              {/* <CartDropdown /> */}
              {!(pathName.startsWith('/cart') || pathName.startsWith('/checkout')) && <CartDropdown />}
              {isAuthenticated && <AvatarDropdown />}
            </div>
          </nav>
        </div>

        {/* Mobile Menu */}
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-40 bg-black bg-opacity-25" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto bg-white p-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center">
                <Image
                  alt="Padoolo Logo"
                  src="/padoolo1.png"
                  className="w-14 h-14"
                  width={50}
                  height={50}
                />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 p-2.5 text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6 space-y-4 flex flex-col">
              {/*<Disclosure>
                {({ open }) => (
                  <>
                    <DisclosureButton className="flex w-full items-center justify-between rounded-md py-2 px-3 text-base font-semibold text-gray-900 hover:bg-gray-50">
                      Products
                      <ChevronDownIcon
                        className={`h-5 w-5 transform ${open ? "rotate-180" : ""}`}
                      />
                    </DisclosureButton>
                    <DisclosurePanel className="space-y-2 px-3">
                      {[...products, ...callsToAction].map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="block text-sm font-medium text-gray-700 hover:underline"
                        >
                          {item.name}
                        </a>
                      ))}
                    </DisclosurePanel>
                  </>
                )}
              </Disclosure>*/}
              <Link
                href="/"
                prefetch={true}
                className="text-base font-medium text-gray-900"
              >
                Home
              </Link>

                                        {/* {categories.map((category) => (
                                  <HoverPopover key={category} label={category} />
                                ))} */}

              <Link
                href="/sunglasses"
                className="text-base font-medium text-gray-900"
                prefetch={true}
              >
                Sunglasses
              </Link>
              <Link
                href="/new-arrivals"
                className="text-base font-medium text-gray-900"
                prefetch={true}
              >
                New Arrivals
              </Link>
              <Link
                href="/clothing"
                className="text-base font-medium text-gray-900"
                prefetch={true}
              >
                Clothing
              </Link>
              <Link
                href="/eyeglasses"
                className="text-base font-medium text-gray-900"
                prefetch={true}
              >
                Eyeglasses
              </Link>
              <Link
                href="/spotlight-deals"
                className="text-base font-medium text-gray-900"
                prefetch={true}
              >
                Spotlight Deals
              </Link>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-4 space-y-4">
              {/*<div className="flex gap-4 text-[#011e41]">
                <SquaresPlusIcon className="h-5 w-5" />
                <CursorArrowRaysIcon className="h-5 w-5" />
                <ChartPieIcon className="h-5 w-5" />
                <FingerPrintIcon className="h-5 w-5" />
                              </div>*/}
              <div className="text-sm text-gray-700">
                Summer sale discount off 70%{" "}
                <Link href="/shop" className="font-semibold text-[#011e41] underline">
                  Shop Now
                </Link>
              </div>
              <div className="flex flex-col space-y-1 text-[#011e41] text-sm font-medium hidden">
                <a href="#">About</a>
                <a href="#">Blog</a>
                <a href="#">Contact</a>
                <a href="#">FAQ&#39;s</a>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
      <Marquee />
    </>
  );
}
