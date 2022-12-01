import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { useOrderConsumer } from '../../context/orderContext';

function OrderPage() {
  // order/:id
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { query } = useRouter();
  const orderId = query.id;
  const {
    loading,
    error,
    order,
    successPay,
    loadingPay,
    fetchOrder,
    resetPay,
    requestPay,
    setPaySuccess,
    failPayResult,
  } = useOrderConsumer();

  useEffect(() => {
    const fetchOrderData = async () => {
      await fetchOrder(orderId);
    };
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrderData();
      if (successPay) {
        resetPay();
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal');
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, orderId, paypalDispatch, successPay]);

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then(orderID => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        requestPay();
        const { data } = await axios.put(`/api/orders/${order._id}/pay`, details);
        setPaySuccess(data);
        toast.success('Order is paid successgully');
        console.log(data.order.orderItems);
        await axios.patch('/api/products', data.order.orderItems);
      } catch (err) {
        failPayResult(err.response?.data?.message ? err.response.data.message : err.message);
        toast.error(err.response?.data?.message ? err.response.data.message : err.message);
      }
    });
  }
  function onError(err) {
    toast.error(err.response?.data?.message ? err.response.data.message : err.message);
  }

  return (
    <Layout title={`Order ${orderId}`}>
      <h1 className='mb-4 text-xl'>{`Order ${orderId}`}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className='p-2.5 mt-2 rounded bg-red-200 text-red-800'>{error}</div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <div className='card  p-5'>
              <h2 className='mb-2 text-lg'>Shipping Address</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address}, {shippingAddress.city},{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </div>
              {isDelivered ? (
                <div className='p-2.5 mt-2 rounded bg-green-200 text-green-800'>
                  Delivered at {deliveredAt}
                </div>
              ) : (
                <div className='p-2.5 mt-2 rounded bg-red-200 text-red-800'>Not delivered</div>
              )}
            </div>

            <div className='card p-5'>
              <h2 className='mb-2 text-lg'>Payment Method</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className='p-2.5 mt-2 rounded bg-green-200 text-green-800'>
                  Paid at {new Date(paidAt).toLocaleString()}
                </div>
              ) : (
                <div className='p-2.5 mt-2 rounded bg-red-200 text-red-800'>Not paid</div>
              )}
            </div>

            <div className='card overflow-x-auto p-5'>
              <h2 className='mb-2 text-lg'>Order Items</h2>
              <table className='min-w-full'>
                <thead className='border-b'>
                  <tr>
                    <th className='px-5 text-left'>Item</th>
                    <th className='    p-5 text-right'>Quantity</th>
                    <th className='  p-5 text-right'>Price</th>
                    <th className='p-5 text-right'>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map(item => (
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
                      <td className=' p-5 text-right'>{item.quantity}</td>
                      <td className='p-5 text-right'>${item.price}</td>
                      <td className='p-5 text-right'>${item.quantity * item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                </li>{' '}
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
                {!isPaid && (
                  <li>
                    {isPending ? (
                      <div>Loading...</div>
                    ) : (
                      <div className='w-full'>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                    {loadingPay && <div>Loading...</div>}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

OrderPage.auth = true;
export default OrderPage;
