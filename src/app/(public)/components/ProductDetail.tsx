"use client";

import { useCartContext } from "@/lib/Contexts/CartContext";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductServices from "@/lib/api/services/ProductServices";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import { ProductVariation, Variation } from "@/types/products";
import WishlistButton from "@/components/WishlistButton";
import ProductImageSwiper from "../product/[slug]/SwiperSlider";
import ProductShareButton from "@/components/ShareButton";
import ProductReviews from "@/components/ProductReviews";

type Props = {
  product: ProductVariation;
  discount?: string | null;
};

export default function ProductDetail({ product, discount }: Props) {
  const { addToCart, cart, loading } = useCartContext();
  // console.log('cart is ', cart);
  const [selectedImage, setSelectedImage] = useState(
    product.images[0]?.src || "/placeholder.jpg"
  );
  const [quantity, setQuantity] = useState(1);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string;
  }>({});
  const [activeVariation, setActiveVariation] = useState<Variation | null>(
    null
  );
  const [activeTab, setActiveTab] = useState(0);
  const [outOfStock, setOutOfStock] = useState<boolean | undefined>(undefined);

  const handleAdd = async (product: ProductVariation) => {
    try {
      addToCart(
        Number(product.id),
        quantity,
        product.name,
        activeVariation?.price
          ? Number(activeVariation.price)
          : Number(product.price),
        activeVariation?.id
      );
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  // console.log("product", product);

  // Increase quantity
  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  // Decrease quantity (prevent going below 1)
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Handle manual input
  // const handleChange = (e) => {
  //   const value = parseInt(e.target.value);
  //   if (!isNaN(value) && value > 0) {
  //     setQuantity(value);
  //   }
  // };

  // console.log('activeVariation', activeVariation);

  const tabs = [
    { label: "Product Description", content: product.description },
    {
      label: "Additional information",
      content: "No additional information yet.",
    },
    {
      label: "Reviews",
      content: <ProductReviews productId={product.id} />,
    },
  ];

  useEffect(() => {
    if (product.variations?.length) {
      Promise.all(
        product.variations.map((id) => ProductServices.getProductById(id))
      ).then((data) => {
        const mapped = data.map((v: any) => ({
          id: v.id,
          price: v.price,
          image: v.images?.[0]?.src || product.images[0]?.src || "",
          attributes: v.attributes.map((attr: any) => ({
            name: attr.name.toLowerCase(),
            option: attr.option.toLowerCase(),
          })),
        }));
        setVariations(mapped);
      });
    }
  }, [product]);

  // Find matching variation
  useEffect(() => {
    if (!variations.length) return;

    const match = variations.find((v) =>
      v.attributes.every(
        (attr) => selectedAttributes[attr.name] === attr.option
      )
    );

    if (!match) {
      setOutOfStock(true);
    } else {
      setOutOfStock(false);
    }

    setActiveVariation(match || null);
    if (match?.image) setSelectedImage(match.image);
  }, [selectedAttributes, variations]);

  const handleAttributeSelect = (name: string, option: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [name.toLowerCase()]: option.toLowerCase(),
    }));
  };

  const priceToShow =
    activeVariation?.price || product.sale_price || product.price;

  return (
    <>
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image Section */}
          <div className="">
            <ProductImageSwiper images={product.images} />
          </div>

          {/* Product Info */}
          <div className="px-4 pDescription">
            <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
            <div
              className="text-gray-800 text-base font-[400] mb-2"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            ></div>

            <div className="flex items-center justify-start gap-2 mb-3">
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

            <div className="flex items-center gap-2 mb-3">
              <span className="text-[24px] font-bold">€{priceToShow}</span>
            </div>

            {/* Dynamic Attributes */}
            <div className="mt-3 mb-6">
              {product.attributes.map((attr) => (
                <div
                  className="mb-4 flex gap-2 items-center justify-start"
                  key={attr.name}
                >
                  <label className="font-medium">{attr.name}:</label>
                  <div className="flex gap-2">
                    {attr.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleAttributeSelect(attr.name, opt)}
                        className={`border border-[#D9D9D9] px-3 py-1 ${
                          selectedAttributes[attr.name.toLowerCase()] ===
                          opt.toLowerCase()
                            ? "bg-gray-300"
                            : ""
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* {outOfStock ? (
              <p className="text-red-600 mb-4">Out of Stock</p>
            ) : (
              ""
            )} */}
            {outOfStock === true && (
              <p className="text-red-600 mb-4 hidden">Out of Stock</p>
            )}

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
                    className={`cursor-pointer bg-[#001F3E] text-[16px] text-white px-6 py-3`}
                    onClick={() => {
                      const idToAdd = activeVariation?.id || product.id;
                      if (outOfStock) {
                        toast.error("Selected variation is out of stock");
                      } else {
                        handleAdd(product);
                      }
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex justify-center items-center w-[90px]">
                        <div className="spinner-border animate-spin border-t-2 border-yellow-600 w-6 h-6 border-solid rounded-full"></div>
                      </div>
                    ) : (
                      "Add to cart"
                    )}
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

            <div className="text-sm text-gray-500 mt-[23px] border-b border-[#BDBDBD] pb-5 space-y-1">
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
                  {product.categories.map((c) => c.name).join(", ")}
                </p>
              ) : (
                ""
              )}
              {product.tags.length > 0 ? (
                <p>
                  <strong>Tags:</strong>{" "}
                  {product.tags.map((t) => t.name).join(", ")}
                </p>
              ) : (
                ""
              )}
            </div>

            {/* zip code section */}
            <div className="pt-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Zip Code Input & Button */}
                <div className="w-[60%] flex flex-col gap-2">
                  <div className="flex border border-gray-300 overflow-hidden">
                    <input
                      type="text"
                      placeholder="Enter zip your zipcode"
                      className="px-4 py-2 outline-none w-full"
                    />
                    <button className="bg-[#D99E46] text-white px-6 py-2 hover:bg-yellow-700 transition">
                      Apply
                    </button>
                  </div>

                  {/* Offer + Card Icons */}
                  <div className="flex items-center gap-4">
                    <p className="text-[12px] text-gray-600">
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
                      <span>Shipping and Return</span>
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
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
