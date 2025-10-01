'use server';

import axiosClient from '../clients/axiosClient';

// Function to add a product to the wishlist
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addWishlist(product_id: number, token: string): Promise<{ data: any | null; error: string | null }> {
  try {
    const response = await axiosClient.post('/wishlist/v1/add/', {
      product_id,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Add to wishlist response:', response.data);

    return { data: response.data, error: null };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { data: null, error: error.response?.data?.message || 'Failed to add to wishlist' };
  }
}

// Function to remove a product from the wishlist
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function removeWishlist(product_id: number, token: string): Promise<{ data: any | null; error: string | null }> {
  try {
    const response = await axiosClient.delete('/wishlist/v1/remove/', {
      data: { product_id },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { data: response.data, error: null };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { data: null, error: error.response?.data?.message || 'Failed to remove from wishlist' };
  }
}

// Function to sync wishlist
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function syncWishlist(product_ids: string[], token: string): Promise<{ data: any | null; error: string | null }> {
  try {
    console.log('Syncing wishlist with server:', product_ids, token);
    const response = await axiosClient.post('/wishlist/v1/sync/', {
      product_ids},
      {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { data: response.data, error: null };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { data: null, error: error.response?.data?.message || 'Failed to remove from wishlist' };
  }
}