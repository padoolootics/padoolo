"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Product,
  ProductVariation,
  VariationOptions,
} from "../types/woocommerce";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperCore } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { useCartContext } from "@/lib/Contexts/CartContext";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import WishlistButton from "@/components/WishlistButton";
import ProductShareButton from "@/components/ShareButton";
import ProductReviews from "@/components/ProductReviews";
import ZipCodeChecker from "./ZipcodeChecker";

type ProductClientProps = {
  product: Product;
  variations: ProductVariation[];
};

type MetaItem = {
  id: number;
  key: string;
  value: string;
};

interface ProductMetaProps {
  metaData: MetaItem[];
}

export default function ProductClient({
  product,
  variations,
}: ProductClientProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<VariationOptions>({});
  const [activeVariation, setActiveVariation] =
    useState<ProductVariation | null>(null);
  const [swiperReady, setSwiperReady] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cart, loading } = useCartContext();
  const [activeTab, setActiveTab] = useState(0);

  // console.log("product", product);
  // console.log("activeVariation", activeVariation);

  const productStock: number =
    product.type === "variable"
      ? activeVariation?.stock_quantity ?? 100
      : product.stock_quantity ?? 100;

  const handleIncrement = () => {
    if (quantity < productStock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const tabs = [
    { label: "Product Description", content: product.description },
    // {
    //   label: "Additional information",
    //   content: "No additional information yet.",
    // },
    {
      label: "Reviews",
      content: <ProductReviews productId={product.id} />,
    },
  ];

  const handleAdd = async (product: any) => {
    try {
      addToCart(
        Number(product.id),
        quantity,
        product.name,
        activeVariation?.price || product.price,
        activeVariation?.id
      );
      toast.success(`Product added to cart!`);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  // Reset thumbs swiper when it becomes null (e.g., when images change)
  useEffect(() => {
    if (thumbsSwiper && swiperReady) {
      thumbsSwiper.update(); // Force Swiper to recalculate dimensions
    }
  }, [thumbsSwiper, swiperReady]);

  // --- Variation Matching Logic (Robust against undefined attributes) ---
  const allAttributesSelected = useMemo(() => {
    const requiredAttributes = (product.attributes ?? [])
      .filter((attr) => attr.variation)
      .map((attr) => attr.name);

    if (requiredAttributes.length === 0) {
      return true;
    }

    return requiredAttributes.every((name) => selectedOptions[name]);
  }, [product.attributes, selectedOptions]);

  const currentPrice = activeVariation?.price || product.price;
  const currentStockStatus =
    activeVariation?.stock_status || product.stock_status;

  const getPriceDisplay = () => {
    const regPrice = activeVariation?.regular_price || product.regular_price;
    const salePrice = activeVariation?.sale_price || product.sale_price;
    const price = activeVariation?.price || product.price;

    if (!price) return "Price on Request";

    if (salePrice && parseFloat(salePrice) < parseFloat(regPrice)) {
      return (
        <div className="text-xl font-bold text-black-600">
          <span className="line-through text-gray-400 text-base mr-2">
            €{Number(regPrice).toFixed(2)}
          </span>
          €{Number(salePrice).toFixed(2)}
        </div>
      );
    }
    return (
      <div className="text-2xl font-bold text-gray-800">
        €{Number(price).toFixed(2)}
      </div>
    );
  };

  useEffect(() => {
    if (product.type === "variable" && allAttributesSelected) {
      const matchingVariation = variations.find((variation) =>
        variation.attributes.every(
          (attr) => selectedOptions[attr.name] === attr.option
        )
      );
      setActiveVariation(matchingVariation || null);
    } else {
      setActiveVariation(null);
    }
  }, [selectedOptions, variations, allAttributesSelected, product.type]);

  // --- Image Slider Update Logic ---
  const images = useMemo(() => {
    const baseImages = product.images ?? [];
    return baseImages;
  }, [product.images]);

  // Reset main slider position when images change
  const swiperRef = useRef<SwiperCore | null>(null);
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(0);
    }
  }, [images]);

  // --- Variation Handler ---
  const handleOptionChange = (attributeName: string, option: string) => {
    setSelectedOptions((prev) => ({ ...prev, [attributeName]: option }));
  };

  // --- UI Components ---
  const StockStatusBadge = () => {
    const isInstock = currentStockStatus === "instock";
    return (
      <span
        className={`px-3 py-1 text-sm font-semibold rounded-full ${
          isInstock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {isInstock
          ? (product.stock_quantity == null ? "" : product.stock_quantity) +
            " In Stock"
          : "Out of Stock"}
      </span>
    );
  };

  const metaLabelMap: Record<string, string> = {
    // _sw_retailer_id: "Retailer ID",
    // _sw_retailer_product_id: "Retailer Product ID",
    _sw_condition_slug: "Condition",
    _sw_gender_slug: "Gender",
    _sw_location: "Location",
    // _sw_cost_per_item: "Cost per Item",
  };

  const formatValue = (key: string, value: string) => {
    if (key === "_sw_condition_slug") {
      return value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }

    if (key === "_sw_gender_slug") {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }

    return value;
  };

  const metaOrder = [
    "_sw_condition_slug",
    "_sw_gender_slug",
    // "_sw_location",
  ];

  // --- meta data component
  const ProductMeta = () => {
    if (!product?.meta_data?.length) return null;

    return (
      <div className="mt-6 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metaOrder.map((key) => {
            const item = product.meta_data.find((meta) => meta.key === key);

            if (!item) return null;

            return (
              <div key={item.id} className="flex flex-col">
                <span className="text-lg text-gray-900 font-medium">
                  {metaLabelMap[item.key]}
                </span>
                <span className="text-sm font-normal text-gray-800 mt-1">
                  {formatValue(item.key, item.value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const VariationSelectors = () => {
    const variationAttributes = (product.attributes ?? []).filter(
      (attr) => attr.variation
    );

    return (
      <div className="space-y-4">
        {variationAttributes.map((attr) => (
          <div key={attr.id}>
            <h4 className="text-lg font-semibold mb-2">
              {attr.name}:{" "}
              <span className="font-normal">
                {selectedOptions[attr.name] || "Select"}
              </span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {(attr.options ?? []).map((option) => {
                const isSelected = selectedOptions[attr.name] === option;
                const isOptionAvailable = variations.some((v) =>
                  v.attributes.some(
                    (a) => a.name === attr.name && a.option === option
                  )
                );

                return (
                  <button
                    key={option}
                    onClick={() => handleOptionChange(attr.name, option)}
                    disabled={!isOptionAvailable}
                    className={`
                      px-4 py-2 border rounded-lg text-sm transition-all duration-150
                      ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50 text-indigo-800 font-medium"
                          : "border-gray-300 text-gray-600 hover:bg-gray-100"
                      }
                      ${
                        !isOptionAvailable
                          ? "opacity-50 cursor-not-allowed line-through"
                          : ""
                      }
                    `}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const SimpleProductAttributes = () => {
    const visibleAttributes = (product.attributes ?? []).filter(
      (attr) => !attr.variation && !attr.visible
    );

    // console.log('visibleAttributes', visibleAttributes);

    if (visibleAttributes.length === 0) return null;

    return (
      <div className="mt-0 pt-0">
        {/* <h3 className="text-base font-semibold mb-3">Product Details</h3> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleAttributes.map((attr) => (
            <div key={attr.id} className="flex flex-col">
              <span className="text-lg text-gray-900 font-medium">
                {attr.name}
              </span>{" "}
              <span className="text-sm font-normal text-gray-800 mt-1">
                {(attr.options ?? []).join(", ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- Main Render ---
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* 1. Image Slider (Left Side) */}
        <div className="flex flex-row-reverse gap-4">
          {/* Main Image Slider */}
          <div className="w-full lg:w-4/5">
            <Swiper
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              loop={images.length > 1}
              spaceBetween={10}
              // navigation={true}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[FreeMode, Navigation, Thumbs]}
              className="rounded-lg border border-gray-200 aspect-square"
            >
              {images.map((image, index) => (
                <SwiperSlide key={image.id || index}>
                  <Image
                    src={image.src}
                    alt={image.alt || product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={1200}
                    height={1200}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Thumbnails (Left Side) - FIXED */}
          <div className="hidden lg:block w-1/5">
            {images.length > 0 && (
              <Swiper
                onSwiper={(swiper) => {
                  setThumbsSwiper(swiper);
                  setSwiperReady(true);
                }}
                onResize={(swiper) => {
                  swiper.update(); // Update on resize
                }}
                loop={false}
                spaceBetween={10}
                slidesPerView={4}
                direction="vertical"
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Thumbs]}
                className="h-full max-h-[500px]" // Add max height constraint
                style={{ height: "500px" }} // Fixed height to prevent continuous growth
                watchOverflow={true} // Prevent issues when slides overflow
                observer={true} // Watch for DOM changes
                observeParents={true} // Watch parent DOM changes
                observeSlideChildren={true} // Watch slide children changes
              >
                {images.map((image, index) => (
                  <SwiperSlide
                    key={image.id || index}
                    className="cursor-pointer"
                    style={{ height: "calc(25% - 7.5px)" }} // Fixed slide height (4 slides with gaps)
                  >
                    <div className="h-full">
                      <Image
                        src={image.src}
                        alt={image.alt || `Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover rounded-md border border-gray-200 hover:border-indigo-500 transition-colors"
                        loading="lazy"
                        onLoad={() => {
                          // Update swiper when images load
                          if (thumbsSwiper && swiperReady) {
                            thumbsSwiper.update();
                          }
                        }}
                        width={500}
                        height={500}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>

        {/* 2. Product Details (Right Side) */}
        <div className="space-y-6">
          <div className="text-sm text-gray-500 mt-[23px] space-y-1">
            {product.categories.length > 0 ? (
              <p>
                {product.categories.map((c: any, i: any) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-gray-100 rounded-sm mr-2"
                  >
                    {c.name}
                  </span>
                ))}
              </p>
            ) : (
              ""
            )}
          </div>
          <div className="text-sm text-gray-500 mb-2">
            {product.brands.length > 0 ? (
              <p className="text-2xl font-semibold text-gray-500">
                {product.brands.map((c: any) => c.name).join(", ")}
              </p>
            ) : (
              ""
            )}
          </div>
          <h1
            className="text-xl font-semibold mb-2"
            dangerouslySetInnerHTML={{ __html: product.name }}
          />

          {/* SKU */}
          {product.sku ? (
            <p className="text-gray-400">SKU: {product.sku}</p>
          ) : (
            ""
          )}

          {/* Short Description */}
          {product.short_description && (
            <div
              className="text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
          )}
          {/* Stars and Reviews Section */}
          <div className="flex items-center justify-start gap-2 mb-3 hidden ">
            <div className="flex items-center gap-1 justify-start ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M5.86487 3.05628C6.81485 1.3521 7.28983 0.5 8 0.5C8.71018 0.5 9.18515 1.35209 10.1351 3.05628L10.3809 3.49717C10.6509 3.98145 10.7858 4.22359 10.9963 4.38336C11.2068 4.54312 11.4688 4.60243 11.9931 4.72104L12.4704 4.82902C14.3151 5.24642 15.2375 5.45512 15.457 6.1608C15.6764 6.86645 15.0476 7.60183 13.7899 9.07242L13.4646 9.4529C13.1072 9.8708 12.9285 10.0798 12.8481 10.3383C12.7678 10.5968 12.7948 10.8756 12.8488 11.4332L12.898 11.9408C13.0881 13.903 13.1832 14.884 12.6087 15.3202C12.0341 15.7563 11.1705 15.3586 9.44323 14.5634L8.99638 14.3576C8.50558 14.1316 8.26018 14.0186 8 14.0186C7.73983 14.0186 7.49443 14.1316 7.00363 14.3576L6.55678 14.5634C4.82951 15.3586 3.96589 15.7563 3.39136 15.3202C2.81684 14.884 2.91191 13.903 3.10205 11.9408L3.15124 11.4332C3.20527 10.8756 3.23229 10.5968 3.1519 10.3383C3.07151 10.0798 2.89282 9.8708 2.53544 9.4529L2.21008 9.07242C0.952439 7.60183 0.323616 6.86645 0.543066 6.1608C0.762516 5.45512 1.6849 5.24642 3.52966 4.82902L4.00692 4.72104C4.53114 4.60243 4.79325 4.54312 5.00371 4.38336C5.21416 4.22359 5.34915 3.98146 5.6191 3.49717L5.86487 3.05628Z"
                  fill="#FBD100"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M5.86487 3.05628C6.81485 1.3521 7.28983 0.5 8 0.5C8.71018 0.5 9.18515 1.35209 10.1351 3.05628L10.3809 3.49717C10.6509 3.98145 10.7858 4.22359 10.9963 4.38336C11.2068 4.54312 11.4688 4.60243 11.9931 4.72104L12.4704 4.82902C14.3151 5.24642 15.2375 5.45512 15.457 6.1608C15.6764 6.86645 15.0476 7.60183 13.7899 9.07242L13.4646 9.4529C13.1072 9.8708 12.9285 10.0798 12.8481 10.3383C12.7678 10.5968 12.7948 10.8756 12.8488 11.4332L12.898 11.9408C13.0881 13.903 13.1832 14.884 12.6087 15.3202C12.0341 15.7563 11.1705 15.3586 9.44323 14.5634L8.99638 14.3576C8.50558 14.1316 8.26018 14.0186 8 14.0186C7.73983 14.0186 7.49443 14.1316 7.00363 14.3576L6.55678 14.5634C4.82951 15.3586 3.96589 15.7563 3.39136 15.3202C2.81684 14.884 2.91191 13.903 3.10205 11.9408L3.15124 11.4332C3.20527 10.8756 3.23229 10.5968 3.1519 10.3383C3.07151 10.0798 2.89282 9.8708 2.53544 9.4529L2.21008 9.07242C0.952439 7.60183 0.323616 6.86645 0.543066 6.1608C0.762516 5.45512 1.6849 5.24642 3.52966 4.82902L4.00692 4.72104C4.53114 4.60243 4.79325 4.54312 5.00371 4.38336C5.21416 4.22359 5.34915 3.98146 5.6191 3.49717L5.86487 3.05628Z"
                  fill="#FBD100"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M5.86487 3.05628C6.81485 1.3521 7.28983 0.5 8 0.5C8.71018 0.5 9.18515 1.35209 10.1351 3.05628L10.3809 3.49717C10.6509 3.98145 10.7858 4.22359 10.9963 4.38336C11.2068 4.54312 11.4688 4.60243 11.9931 4.72104L12.4704 4.82902C14.3151 5.24642 15.2375 5.45512 15.457 6.1608C15.6764 6.86645 15.0476 7.60183 13.7899 9.07242L13.4646 9.4529C13.1072 9.8708 12.9285 10.0798 12.8481 10.3383C12.7678 10.5968 12.7948 10.8756 12.8488 11.4332L12.898 11.9408C13.0881 13.903 13.1832 14.884 12.6087 15.3202C12.0341 15.7563 11.1705 15.3586 9.44323 14.5634L8.99638 14.3576C8.50558 14.1316 8.26018 14.0186 8 14.0186C7.73983 14.0186 7.49443 14.1316 7.00363 14.3576L6.55678 14.5634C4.82951 15.3586 3.96589 15.7563 3.39136 15.3202C2.81684 14.884 2.91191 13.903 3.10205 11.9408L3.15124 11.4332C3.20527 10.8756 3.23229 10.5968 3.1519 10.3383C3.07151 10.0798 2.89282 9.8708 2.53544 9.4529L2.21008 9.07242C0.952439 7.60183 0.323616 6.86645 0.543066 6.1608C0.762516 5.45512 1.6849 5.24642 3.52966 4.82902L4.00692 4.72104C4.53114 4.60243 4.79325 4.54312 5.00371 4.38336C5.21416 4.22359 5.34915 3.98146 5.6191 3.49717L5.86487 3.05628Z"
                  fill="#FBD100"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M5.86487 3.05628C6.81485 1.3521 7.28983 0.5 8 0.5C8.71018 0.5 9.18515 1.35209 10.1351 3.05628L10.3809 3.49717C10.6509 3.98145 10.7858 4.22359 10.9963 4.38336C11.2068 4.54312 11.4688 4.60243 11.9931 4.72104L12.4704 4.82902C14.3151 5.24642 15.2375 5.45512 15.457 6.1608C15.6764 6.86645 15.0476 7.60183 13.7899 9.07242L13.4646 9.4529C13.1072 9.8708 12.9285 10.0798 12.8481 10.3383C12.7678 10.5968 12.7948 10.8756 12.8488 11.4332L12.898 11.9408C13.0881 13.903 13.1832 14.884 12.6087 15.3202C12.0341 15.7563 11.1705 15.3586 9.44323 14.5634L8.99638 14.3576C8.50558 14.1316 8.26018 14.0186 8 14.0186C7.73983 14.0186 7.49443 14.1316 7.00363 14.3576L6.55678 14.5634C4.82951 15.3586 3.96589 15.7563 3.39136 15.3202C2.81684 14.884 2.91191 13.903 3.10205 11.9408L3.15124 11.4332C3.20527 10.8756 3.23229 10.5968 3.1519 10.3383C3.07151 10.0798 2.89282 9.8708 2.53544 9.4529L2.21008 9.07242C0.952439 7.60183 0.323616 6.86645 0.543066 6.1608C0.762516 5.45512 1.6849 5.24642 3.52966 4.82902L4.00692 4.72104C4.53114 4.60243 4.79325 4.54312 5.00371 4.38336C5.21416 4.22359 5.34915 3.98146 5.6191 3.49717L5.86487 3.05628Z"
                  fill="#FBD100"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M5.86487 3.05628C6.81485 1.3521 7.28983 0.5 8 0.5C8.71018 0.5 9.18515 1.35209 10.1351 3.05628L10.3809 3.49717C10.6509 3.98145 10.7858 4.22359 10.9963 4.38336C11.2068 4.54312 11.4688 4.60243 11.9931 4.72104L12.4704 4.82902C14.3151 5.24642 15.2375 5.45512 15.457 6.1608C15.6764 6.86645 15.0476 7.60183 13.7899 9.07242L13.4646 9.4529C13.1072 9.8708 12.9285 10.0798 12.8481 10.3383C12.7678 10.5968 12.7948 10.8756 12.8488 11.4332L12.898 11.9408C13.0881 13.903 13.1832 14.884 12.6087 15.3202C12.0341 15.7563 11.1705 15.3586 9.44323 14.5634L8.99638 14.3576C8.50558 14.1316 8.26018 14.0186 8 14.0186C7.73983 14.0186 7.49443 14.1316 7.00363 14.3576L6.55678 14.5634C4.82951 15.3586 3.96589 15.7563 3.39136 15.3202C2.81684 14.884 2.91191 13.903 3.10205 11.9408L3.15124 11.4332C3.20527 10.8756 3.23229 10.5968 3.1519 10.3383C3.07151 10.0798 2.89282 9.8708 2.53544 9.4529L2.21008 9.07242C0.952439 7.60183 0.323616 6.86645 0.543066 6.1608C0.762516 5.45512 1.6849 5.24642 3.52966 4.82902L4.00692 4.72104C4.53114 4.60243 4.79325 4.54312 5.00371 4.38336C5.21416 4.22359 5.34915 3.98146 5.6191 3.49717L5.86487 3.05628Z"
                  fill="#A7A7A7"
                />
              </svg>
            </div>
            <div>
              <span className="text-[16px] font-[500] mr-2">4.5</span>
              <span className="text-[14px] font-[200]">12 Reviews</span>
            </div>
          </div>

          {/* Price and Stock */}
          <div className="flex items-center space-x-4">
            {getPriceDisplay()}
            <StockStatusBadge />
          </div>

          {/* Showing Meta Data */}
          <ProductMeta />

          {/* Variation Selector (for variable product) */}
          {product.type === "variable" && <VariationSelectors />}

          {/* Simple Product Attributes */}
          {product.type === "simple" && <SimpleProductAttributes />}

          {/* Add to Cart/Action, Qualtity, share wishlist Button */}
          <div className="border-t border-[#BDBDBD] pt-6 flex items-center gap-3 mb-4">
            {/* parent container */}
            <div className="flex items-center justify-between w-full">
              {/*  left-container */}
              <div className="flex items-center justify-start gap-2 ">
                <div className="border border-gray-300 px-4 w-[130px] py-2 flex items-center justify-between w-24">
                  <button
                    onClick={handleDecrement}
                    className="cursor-pointer text-2xl font-light hover:text-gray-600"
                  >
                    -
                  </button>
                  <span className="text-lg">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    className="cursor-pointer text-2xl font-light hover:text-gray-600"
                  >
                    +
                  </button>
                </div>

                <button
                  className={`cursor-pointer bg-[#001F3E] text-[16px] text-white px-6 py-3 ${
                    currentStockStatus === "instock" &&
                    (product.type !== "variable" || allAttributesSelected)
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={
                    currentStockStatus !== "instock" ||
                    (product.type === "variable" && !allAttributesSelected)
                  }
                  onClick={() => {
                    handleAdd(product);
                  }}
                >
                  {currentStockStatus === "instock"
                    ? product.type === "variable" && !allAttributesSelected
                      ? "Select Options"
                      : "Add to Cart"
                    : "Out of Stock"}
                </button>

                <Link
                  href={"/checkout"}
                  className="cursor-pointer hidden bg-[#D99E46] text-white text-[16px] px-6 py-3"
                >
                  Buy now
                </Link>
              </div>
            </div>
            {/* right-container */}
            <div className="flex items-center justify-center gap-2">
              <figure className="border border-[#D9D9D9] h-[46px] w-[46px] p-[5px] cursor-pointer hover:bg-[#00000015] transition flex items-center justify-center">
                <Image
                  src="/share-icon.svg"
                  alt="share icon"
                  width={20}
                  height={20}
                  className="hidden"
                />
                <ProductShareButton productName={product.name} />
              </figure>
              <figure className="border border-[#D9D9D9] h-[46px] w-[46px] p-[5px] cursor-pointer hover:bg-[#00000015] transition flex items-center justify-center">
                <WishlistButton product_id={product.id} />
              </figure>
            </div>
          </div>

          {/* SKU Tags Categories brands Name display section */}
          <div className="text-sm text-gray-500 mt-[23px] border-b border-[#BDBDBD] pb-5 space-y-1 hidden">
            {product.brands.length > 0 ? (
              <p>
                <strong>Brands:</strong>{" "}
                {product.brands.map((c: any) => c.name).join(", ")}
              </p>
            ) : (
              ""
            )}
            {product.sku ? (
              <p>
                <strong>SKU:</strong> {product.sku}
              </p>
            ) : (
              ""
            )}
            {product.categories.length > 0 ? (
              <p>
                <strong>Category:</strong>{" "}
                {product.categories.map((c: any) => c.name).join(", ")}
              </p>
            ) : (
              ""
            )}
            {product.tags.length > 0 ? (
              <p>
                <strong>Tags:</strong>{" "}
                {product.tags.map((t: any) => t.name).join(", ")}
              </p>
            ) : (
              ""
            )}
          </div>

          {/* zip code section */}
          <div className="pt-4 border-b border-[#BDBDBD] pb-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Zip Code Input & Button */}
              <div className="w-[100%] flex flex-col gap-2 md:w-[70%]">
                <ZipCodeChecker />

                {/* Offer + Card Icons */}
                <div className="flex items-center gap-4">
                  <p className="text-[14px] text-gray-600">
                    Pay by credit cards.
                  </p>
                  <div className="flex gap-2">
                    <Image
                      src="/detail-pay-options-img.svg"
                      alt="Visa"
                      className="h-6"
                      width={150}
                      height={24}
                    />
                  </div>
                </div>
              </div>

              {/* Delivery & Views */}
              <div className="flex flex-col gap-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <figure>
                    <Image
                      src="/truck.svg"
                      alt="truck image"
                      width={35}
                      height={35}
                    />
                  </figure>
                  <Link href={"/shipping-and-returns-policy"}>
                    <span>Shipping Policy</span>
                  </Link>
                </div>
                <div className="flex items-center gap-2 hidden">
                  <figure>
                    <Image
                      src="/eye-svg.svg"
                      alt="eye image"
                      width={23}
                      height={23}
                    />
                  </figure>
                  <span>523 People View</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        {/* Tab headers */}
        <div className="flex space-x-6 border-b border-gray-300 mt-4 mb-4">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`w-[200px] py-2 px-1 text-base transition-all duration-150 border-b-2 ${
                activeTab === index
                  ? "border-black text-black font-medium"
                  : "border-transparent text-gray-500 hover:text-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tabs[activeTab].label === "Reviews" ? (
          <div className="mt-4 font-normal pb-3 text-base text-gray-800 tabContentP">
            {tabs[activeTab].content}
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: tabs[activeTab].content as string,
            }}
            className="mt-4 font-normal pb-3 text-base text-gray-800 tabContentP"
          ></div>
        )}
      </div>
    </>
  );
}
