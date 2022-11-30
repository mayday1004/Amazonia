import Link from 'next/link';
import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import { useOrderConsumer } from '../context/orderContext';

function OrderHistoryScreen() {
  const { loading, error, orders, fetchAllOrders } = useOrderConsumer();

  useEffect(() => {
    const fetchOrders = async () => {
      await fetchAllOrders();
    };
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Layout title='Order History'>
      <h1 className='mb-4 text-xl'>Order History</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className='alert-error'>{error}</div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full'>
            <thead className='border-b'>
              <tr>
                <th className='px-5 text-left'>ID</th>
                <th className='p-5 text-left'>DATE</th>
                <th className='p-5 text-left'>TOTAL</th>
                <th className='p-5 text-left'>PAID</th>
                <th className='p-5 text-left'>DELIVERED</th>
                <th className='p-5 text-left'>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className='border-b'>
                  <td className=' p-5 '>{order._id.substring(20, 24)}</td>
                  <td className=' p-5 '>{order.createdAt.substring(0, 10)}</td>
                  <td className=' p-5 '>${order.totalPrice}</td>
                  <td className=' p-5 '>{order.isPaid ? `${order.paidAt.substring(0, 10)}` : 'not paid'}</td>
                  <td className=' p-5 '>
                    {order.isDelivered ? `${order.deliveredAt.substring(0, 10)}` : 'not delivered'}
                  </td>
                  <td className=' p-5 '>
                    <Link href={`/order/${order._id}`} passHref legacyBehavior>
                      <a>Details</a>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}

OrderHistoryScreen.auth = true;
export default OrderHistoryScreen;
