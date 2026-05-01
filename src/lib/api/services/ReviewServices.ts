export interface Review {
  id: number;
  reviewer: string;
  review: string;
  rating: number;
  date_created: string;
}

export interface ReviewSubmission {
  product_id: number;
  rating: number;
  review: string;
  reviewer: string;
  reviewer_email: string;
}

const ReviewServices = {
  getReviewsByProductId: async (productId: number): Promise<Review[]> => {
    const response = await fetch(`/api/reviews?productId=${productId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch reviews.");
    }
    return response.json();
  },

  submitReview: async (reviewData: ReviewSubmission): Promise<any> => {
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to submit review.");
    }
    return response.json();
  },
};

export default ReviewServices;
