import requests from './httpServices';
import logger from '@/lib/utils/logger';

export interface PaymentGateway {
  id: string;
  title: string;
  description: string;
}

export interface CouponValidationResponse {
  valid: boolean;
  message: string;
}

const CheckoutServices = {
  getPaymentGateways: async (): Promise<PaymentGateway[]> => {
    return requests.get<PaymentGateway[]>('/payment-gateways');
  },

  validateCoupon: async (couponCode: string): Promise<CouponValidationResponse> => {
    logger.trackCheckout('Validate Coupon', { couponCode });
    try {
      const response = await fetch('/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ couponCode }),
      });
      const data = await response.json();
      if (!data.valid) {
        logger.warn('Coupon validation failed', { couponCode, message: data.message });
      }
      return data;
    } catch (error) {
      logger.error('Error validating coupon', { couponCode, error });
      throw error;
    }
  },

  createOrder: async (orderData: any): Promise<any> => {
    logger.trackCheckout('Create Order Attempt', { 
      email: orderData.billing?.email,
      total: orderData.total 
    });
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      const data = await response.json();
      
      if (data.id) {
        logger.info('Order created successfully', { orderId: data.id });
      } else {
        logger.error('Order creation failed', { response: data });
      }
      return data;
    } catch (error) {
      logger.error('Exception during order creation', { error });
      throw error;
    }
  }
};

export default CheckoutServices;
