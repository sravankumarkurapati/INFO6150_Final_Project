import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from '../axiosInstance';

const StripeCheckoutForm = ({ amount, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const res = await axios.post('/payment/create-payment-intent', { amount });
      const clientSecret = res.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          onPaymentSuccess();
        }
      }
    } catch (err) {
      setError('Payment failed. Try again.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {error && <p className="text-danger">{error}</p>}
      <button disabled={!stripe || processing} className="btn btn-success mt-3">
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default StripeCheckoutForm;