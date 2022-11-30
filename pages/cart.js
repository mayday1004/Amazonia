import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { HiOutlineXCircle } from 'react-icons/hi';
import Layout from '../components/Layout';
import { useStoreConsumer } from '../context/storeContext';

const CartDetail = () => {
  const router = useRouter();
  const { cart, removeItemHandler, updateCartHandler } = useStoreConsumer();
  return (
    <Layout title='Shopping Cart'>
      <h1 className='mb-4 text-xl'>Shopping Cart</h1>
      {cart.cartItems.length === 0 ? (
        <div>
          Cart is empty. <Link href='/'>Go Shopping</Link>
        </div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <table className='min-w-full '>
              <thead className='border-b'>
                <tr>
                  <th className='p-5 text-left'>Item</th>
                  <th className='p-5 text-right'>Quantity</th>
                  <th className='p-5 text-right'>Price</th>
                  <th className='p-5'>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.cartItems.map(item => (
                  <tr key={item.slug} className='border-b'>
                    <td>
                      <Link href={`/product/${item.slug}`} legacyBehavior>
                        <a className='flex items-center'>
                          <Image src={item.image} alt={item.name} width={50} height={50}></Image>
                          &nbsp;
                          {item.name}
                        </a>
                      </Link>
                    </td>
                    <td className='p-5 text-right'>
                      <select value={item.quantity} onChange={e => updateCartHandler(item, e.target.value)}>
                        {[...Array(item.countInStock).keys()].map(x => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className='p-5 text-right'>${item.price}</td>
                    <td className='p-5 text-center'>
                      <button onClick={() => removeItemHandler(item)}>
                        <HiOutlineXCircle className='h-5 w-5'></HiOutlineXCircle>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='card p-5'>
            <ul>
              <li>
                <div className='pb-3 text-xl'>
                  Subtotal ({cart.cartItems.reduce((a, c) => a + c.quantity, 0)}) : $
                  {cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                </div>
              </li>
              <li>
                <button
                  onClick={() => router.push('login?redirect=/shipping')}
                  className='primary-button w-full'
                >
                  Check Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(CartDetail), { ssr: false });
