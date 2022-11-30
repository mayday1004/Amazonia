import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import CheckoutStep from '../components/CheckoutStep';
import { useStoreConsumer } from '../context/storeContext';

const Payment = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const { cart, submitPaymentMethod } = useStoreConsumer();
  const { shippingAddress, paymentMethod } = cart;
  const router = useRouter();

  const submitHandler = e => {
    e.preventDefault();
    submitPaymentMethod(selectedPaymentMethod);
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      router.push('/shipping');
    }
    setSelectedPaymentMethod(paymentMethod || '');
  }, [paymentMethod, router, shippingAddress.address]);

  return (
    <Layout title='Payment Method'>
      <CheckoutStep activeStep={2} />
      <form className='mx-auto max-w-screen-md' onSubmit={submitHandler}>
        <h1 className='mb-4 text-xl'>Payment Method</h1>
        {['PayPal', 'Stripe', 'CashOnDelivery'].map(payment => (
          <div key={payment} className='mb-4'>
            <input
              name='paymentMethod'
              className='p-2 outline-none focus:ring-0'
              id={payment}
              type='radio'
              checked={selectedPaymentMethod === payment}
              onChange={() => setSelectedPaymentMethod(payment)}
            />

            <label className='p-2' htmlFor={payment}>
              {payment}
            </label>
          </div>
        ))}
        <div className='mb-4 flex justify-between'>
          <button onClick={() => router.push('/shipping')} type='button' className='default-button'>
            Back
          </button>
          <button className='primary-button'>Next</button>
        </div>
      </form>
    </Layout>
  );
};

Payment.auth = true;
export default Payment;
