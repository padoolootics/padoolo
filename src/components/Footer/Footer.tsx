"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import hfSettingServices from "@/lib/api/services/headerFooterSettings";

/* ---------------------------------
   FALLBACK DATA (API-COMPATIBLE)
---------------------------------- */

const fallbackFooterMenus = {
  menu_1: {
    title: "COMPANY INFO",
    items: [
      { label: "About Us", url: "/about", target: "_self" },
      { label: "Contact Us", url: "/contact", target: "_self" },
      { label: "My Account", url: "/dashboard", target: "_self" },
      { label: "Shop", url: "/shop", target: "_self" },
    ],
  },
  menu_2: {
    title: "SUPPORT",
    items: [
      { label: "Order Status", url: "/", target: "_self" },
      { label: "Shopping Support", url: "/", target: "_self" },
      {
        label: "Shipping & Returns Policy",
        url: "/shipping-and-returns-policy",
        target: "_self",
      },
    ],
  },
  menu_3: {
    title: "SHOP BY",
    items: [
      { label: "Sunglasses", url: "/sunglasses", target: "_self" },
      { label: "Clothes", url: "/clothing", target: "_self" },
      { label: "New Arrival", url: "/new-arrivals", target: "_self" },
      { label: "Spotlight Deals", url: "/spotlight-deals", target: "_self" },
    ],
  },
  menu_4: {
    title: "MORE INFO",
    items: [
      { label: "FAQs", url: "/faqs", target: "_self" },
      { label: "Terms & Conditions", url: "/terms-and-conditions", target: "_self" },
    ],
  },
};

const fallbackFooter = {
  footer_logo: "/padoolo1.png",
  footer_menus: fallbackFooterMenus,
  social_links: [],
  icon_boxes: [],
  footer_copyright:
    "Copyright ©2026 Padoolo. All Rights Reserved.",
};

const socialIconMap: Record<string, string> = {
  facebook: "fab fa-facebook-f",
  instagram: "fab fa-instagram",
  twitter: "fab fa-x-twitter",
  x: "fab fa-x-twitter",
  linkedin: "fab fa-linkedin-in",
  youtube: "fab fa-youtube",
};

/* ---------------------------------
   FOOTER COMPONENT
---------------------------------- */

const Footer: React.FC = () => {
  const [footer, setFooter] = useState<any>(fallbackFooter);

  useEffect(() => {
    hfSettingServices
      .getHFSettings()
      .then((data) => {
        if (data?.footer) {
          setFooter({
            footer_logo: data.footer.footer_logo || fallbackFooter.footer_logo,
            footer_menus: data.footer.footer_menus || fallbackFooter.footer_menus,
            social_links: data.footer.social_links || [],
            icon_boxes: data.footer.icon_boxes || [],
            footer_copyright:
              data.footer.footer_copyright ||
              fallbackFooter.footer_copyright,
          });
        }
      })
      .catch(() => setFooter(fallbackFooter));
  }, []);

  const menus = footer.footer_menus;

  return (
    <footer className="bg-white text-slate-800 text-sm">

      {/* ---------------- TOP ICON BOXES (DYNAMIC) ---------------- */}
      <div className="border-b">
        <div className="container m-auto">
          <div className="py-4 px-4 md:px-6 flex flex-wrap justify-between items-center gap-6">
            {(footer.icon_boxes.length
              ? footer.icon_boxes
              : []
            ).map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-4">
                <Image
                  src={item.url}
                  alt={item.label}
                  width={60}
                  height={60}
                />
                <div>
                  <p className="font-semibold text-lg">{item.label}</p>
                  <p className="text-xs text-slate-600">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- FOOTER MENUS ---------------- */}
      <div className="border-b">
        <div className="container m-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-5 gap-6 px-4 md:px-6 py-14">
            {Object.values(menus).map((menu: any, idx: number) => (
              <div key={idx}>
                <h4 className="font-semibold mb-4">{menu.title}</h4>
                <ul className="space-y-4 text-slate-600 text-sm">
                  {menu.items.map((item: any, i: number) => (
                    <li key={i}>
                      <Link href={item.url} target={item.target}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* ---------------- NEWSLETTER ---------------- */}
            <div className="w-full md:w-[280px] text-center md:text-left">
              <Image
                src={footer.footer_logo}
                alt="Padoolo Logo"
                width={180}
                height={62}
                className="mb-4 mx-auto md:mx-0"
              />

              <h4 className="font-semibold mb-2">SIGN UP FOR EMAIL</h4>
              <p className="text-xs text-slate-600 mb-3">
                Enjoy 15% your first order when you signup to our newsletter.
              </p>

              <div className="flex mb-4">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-2/3 px-3 py-2 border rounded-l text-sm"
                />
                <button className="bg-amber-500 text-white px-4 rounded-r">
                  SIGN UP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- BOTTOM ---------------- */}
      <div className="container m-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-6 py-6 text-slate-500">
          <p>{footer.footer_copyright}</p>

          {/* SOCIAL ICONS */}
          <div className="flex space-x-3 text-xl text-slate-600">
            {footer.social_links.map((item: any, i: number) => {
              const iconClass =
                socialIconMap[item.label.toLowerCase()] || "fas fa-globe";

              return (
                <a
                  key={i}
                  href={item.url}
                  target={item.target}
                  rel="noopener noreferrer"
                  aria-label={item.label}
                >
                  <i className={iconClass}></i>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
