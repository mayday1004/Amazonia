import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Layout from '../components/Layout';
import CheckoutStep from '../components/CheckoutStep';
import { useStoreConsumer } from '../context/storeContext';

const Placeorder = () => {
  const [loading, setLoading] = useState(false);
  const { cart, placeOrderHandler } = useStoreConsumer();
  const { cartItems, shippingAddress, paymentMethod } = cart;

  const round2 = num => Math.round(num * 100 + Number.EPSILON) / 100;

  const itemsPrice = round2(cartItems.reduce((a, c) => a + c.quantity * c.price, 0)); // 123.4567 => 123.46

  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  const onClickHandler = async () => {
    await placeOrderHandler(
      setLoading,
      cartItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    );
  };

  return (
    <Layout title='Place Order'>
      <CheckoutStep activeStep={3} />
      <h1 className='mb-4 text-xl'>Place Order</h1>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty. <Link href='/'>Go shopping</Link>
        </div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <div className='card  p-5'>
              <h2 className='mb-2 text-lg'>Shipping Address</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address}, {shippingAddress.city},{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </div>
              <div>
                <Link href='/shipping'>Edit</Link>
              </div>
            </div>
            <div className='card  p-5'>
              <h2 className='mb-2 text-lg'>Payment Method</h2>
              <div>{paymentMethod}</div>
              <div>
                <Link href='/payment'>Edit</Link>
              </div>
            </div>
            <div className='card overflow-x-auto p-5'>
              <h2 className='mb-2 text-lg'>Order Items</h2>
              <table className='min-w-full'>
                <thead className='border-b'>
                  <tr>
                    <th className='px-5 text-left'>Item</th>
                    <th className='p-5 text-right'>Quantity</th>
                    <th className='p-5 text-right'>Price</th>
                    <th className='p-5 text-right'>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item._id} className='border-b'>
                      <td>
                        <Link href={`/product/${item.slug}`} legacyBehavior>
                          <a className='flex items-center'>
                            <Image src={item.image} alt={item.name} width={50} height={50}></Image>
                            &nbsp;
                            {item.name}
                          </a>
                        </Link>
                      </td>
                      <td className='p-5 text-right'>{item.quantity}</td>
                      <td className='p-5 text-right'>${item.price}</td>
                      <td className='p-5 text-right'>${item.quantity * item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <Link href='/cart'>Edit</Link>
              </div>
            </div>
          </div>
          <div>
            <div className='card  p-5'>
              <h2 className='mb-2 text-lg'>Order Summary</h2>
              <ul>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Items</div>
                    <div>${itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Tax</div>
                    <div>${taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Shipping</div>
                    <div>${shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Total</div>
                    <div>${totalPrice}</div>
                  </div>
                </li>
                <li>
                  <button disabled={loading} onClick={onClickHandler} className='primary-button w-full'>
                    {loading ? 'Loading...' : 'Place Order'}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Placeorder;

Placeorder.auth = true;
