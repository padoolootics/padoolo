"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// We'll use a simple SVG for the share icon to remove the dependency on 'react-icons'
const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 text-gray-600"
  >
    <path
      fillRule="evenodd"
      d="M15.75 4.5a3 3 0 11.536 2.05L6.592 9.21a3.001 3.001 0 010 5.58l9.694 2.661a3 3 0 11-.536 2.05 3 3 0 01-.536-2.05L7.408 14.79a3.001 3.001 0 010-5.58l9.694-2.661a3 3 0 01.536-2.05z"
      clipRule="evenodd"
    />
  </svg>
);

// A component to display the social share links in a pop-up
interface SharePopupProps {
  shareUrl: string;
  onClose: () => void;
}

const SharePopup: React.FC<SharePopupProps> = ({ shareUrl, onClose }) => {
  const [copied, setCopied] = useState(false);

  // URLs for social media sharing
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    shareUrl
  )}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl
  )}`;
  const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
    shareUrl
  )}`;

  const handleCopyLink = () => {
    // Check if the browser supports the Clipboard API
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000); // Reset message after 2 seconds
        })
        .catch((err) => {
          console.error("Failed to copy link: ", err);
        });
    } else {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4 text-center">
          Share this product
        </h3>
        <div className="flex flex-col space-y-3">
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center py-2 px-4 rounded-lg bg-blue-400 text-white font-medium hover:bg-blue-500 transition-colors"
          >
            Share on Twitter
          </a>
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center py-2 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Share on Facebook
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center py-2 px-4 rounded-lg bg-blue-800 text-white font-medium hover:bg-blue-900 transition-colors"
          >
            Share on LinkedIn
          </a>
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center py-2 px-4 rounded-lg border border-gray-300 text-gray-800 font-medium hover:bg-gray-100 transition-colors"
          >
            {copied ? "Link Copied!" : "Copy Link"}
          </button>
        </div>
      </div>
    </div>
  );
};

// The main share button component for your product page
interface ProductShareButtonProps {
  productName: string;
}

const ProductShareButton: React.FC<ProductShareButtonProps> = ({
  productName,
}) => {
  const [shareUrl, setShareUrl] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // Use useEffect to get the current URL on the client-side
  // This prevents a hydration error because the window object is not available on the server
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  const handleShareClick = async () => {
    // Web Share API is the preferred modern method
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName || "Check out this product!",
          text: `I found this awesome product: ${productName}. Check it out!`,
          url: shareUrl,
        });
        console.log("Product shared successfully!");
      } catch (error) {
        console.error("Error sharing the product:", error);
      }
    } else {
      // Fallback to a custom pop-up for browsers that don't support the API
      setShowPopup(true);
    }
  };

  return (
    <>
      <figure
        onClick={handleShareClick}
        className="border-0 border-[#D9D9D9] h-[46px] w-[46px] cursor-pointer transition flex items-center justify-center"
      >
        <Image src="/share-icon.svg" alt="share icon" width={20} height={20} />
      </figure>

      {/* Render the popup conditionally */}
      {showPopup && (
        <SharePopup shareUrl={shareUrl} onClose={() => setShowPopup(false)} />
      )}
    </>
  );
};

export default ProductShareButton;
