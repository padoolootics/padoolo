"use client";

import { useAuth } from "@/lib/Contexts/AuthContext";
import React, { useState, useEffect, FormEvent } from "react";

// Type definitions for the data
interface Review {
  id: number;
  reviewer: string;
  review: string;
  rating: number;
  date_created: string;
}

interface ProductReviewsProps {
  productId: number;
}

// A simple star rating component for the review form
const StarRating: React.FC<{
  rating: number;
  setRating: (r: number) => void;
}> = ({ rating, setRating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`text-2xl cursor-pointer transition-colors ${
            i < rating ? "text-yellow-400" : "text-gray-300 hover:text-gray-400"
          }`}
          onClick={() => setRating(i + 1)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(
    null
  );
  const { isAuthenticated } = useAuth();

  // Form state for adding a new review
  const [newReview, setNewReview] = useState({
    rating: 5,
    review: "",
    reviewer: "",
    reviewer_email: "",
  });

  // Function to fetch reviews from the Next.js API route
  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      // Updated fetch URL to match your `app/api/reviews/route.ts` file path
      const response = await fetch(`/api/reviews?productId=${productId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch reviews.");
      }
      const data: Review[] = await response.json();
      setReviews(data);
    } catch (err) {
      setError("Could not load reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle form submission
  const handleSubmitReview = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionMessage(null);

    try {
      // Updated fetch URL to match your `app/api/reviews/route.ts` file path
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newReview,
          product_id: productId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit review.");
      }

      setSubmissionMessage("Your review has been submitted successfully!");
      // Reset the form after successful submission
      setNewReview({ rating: 5, review: "", reviewer: "", reviewer_email: "" });
      fetchReviews(); // Re-fetch reviews to show the new one
    } catch (err: any) {
      setSubmissionMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch reviews on initial component load or when productId changes
  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  return (
    <div className="bg-white p-0 rounded-lg mx-auto font-sans">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Product Reviews
      </h2>

      {/* Display existing reviews */}
      <div className="space-y-6 mb-8">
        {loading && (
          <p className="text-center text-gray-500">Loading reviews...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && reviews.length === 0 && !error && (
          <p className="text-center text-gray-500">
            No reviews yet. Be the first to leave one!
          </p>
        )}
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-4">
            <div className="flex items-center mb-1">
              <span className="font-semibold text-gray-800">
                {review.reviewer}
              </span>
              <span className="ml-4 text-sm text-gray-500">
                {new Date(review.date_created).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-xl ${
                    i < review.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: review.review }}
              className="mt-4 font-normal pb-3 text-base text-gray-800 tabContentP"
            ></div>
          </div>
        ))}
      </div>

      {/* Form to add a new review */}
      {isAuthenticated && (
        <div className="border-t border-gray-300 pt-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Leave a Review
          </h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-gray-700"
              >
                Rating
              </label>
              <StarRating
                rating={newReview.rating}
                setRating={(r) => setNewReview({ ...newReview, rating: r })}
              />
            </div>
            <div>
              <label
                htmlFor="review"
                className="block text-sm font-medium text-gray-700"
              >
                Your Review
              </label>
              <textarea
                id="review"
                name="review"
                rows={4}
                value={newReview.review}
                onChange={(e) =>
                  setNewReview({ ...newReview, review: e.target.value })
                }
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="reviewer_name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="reviewer_name"
                name="reviewer_name"
                value={newReview.reviewer}
                onChange={(e) =>
                  setNewReview({ ...newReview, reviewer: e.target.value })
                }
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="reviewer_email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="reviewer_email"
                name="reviewer_email"
                value={newReview.reviewer_email}
                onChange={(e) =>
                  setNewReview({ ...newReview, reviewer_email: e.target.value })
                }
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-fit cursor-pointer py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-indigo-300 transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
          {submissionMessage && (
            <p
              className={`mt-4 text-sm font-medium ${
                submissionMessage.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {submissionMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
