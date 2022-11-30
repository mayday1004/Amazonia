import React, { useReducer, useContext } from 'react';
import axios from 'axios';
import catchErr from '../utils/error';
import reducer from './orderReducer';
import {
  FETCH_REQUEST,
  FETCH_ORDER_SUCCESS,
  FETCH_ORDERS_SUCCESS,
  FETCH_FAIL,
  PAY_REQUEST,
  PAY_SUCCESS,
  PAY_FAIL,
  PAY_RESET,
} from './action';

const initialState = {
  loading: true,
  order: {
    shippingAddress: { fullName: '', address: '', city: '', postalCode: '', country: '' },
    paymentMethod: '',
    orderItems: [],
    itemsPrice: 0,
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: 0,
    isPaid: false,
    paidAt: '',
    isDelivered: false,
    deliveredAt: '',
  },
  orders: [],
  error: '',
  successPay: false,
  loadingPay: false,
};

const OrderContext = React.createContext();
const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchOrder = async orderId => {
    try {
      dispatch({ type: FETCH_REQUEST });
      const { data } = await axios.get(`/api/orders/${orderId}`);
      dispatch({ type: FETCH_ORDER_SUCCESS, payload: data });
    } catch (err) {
      dispatch({
        type: FETCH_FAIL,
        payload: catchErr(err),
      });
    }
  };

  const resetPay = () => {
    dispatch({ type: PAY_RESET });
  };

  const requestPay = () => {
    dispatch({ type: PAY_REQUEST });
  };

  const setPaySuccess = data => {
    dispatch({ type: PAY_SUCCESS, payload: data });
  };

  const failPayResult = err => {
    dispatch({ type: PAY_FAIL, payload: err });
  };

  const fetchAllOrders = async () => {
    try {
      dispatch({ type: FETCH_REQUEST });
      const { data } = await axios.get('/api/orders/history');
      dispatch({ type: FETCH_ORDERS_SUCCESS, payload: data });
    } catch (err) {
      dispatch({
        type: FETCH_FAIL,
        payload: catchErr(err),
      });
    }
  };

  return (
    <OrderContext.Provider
      value={{
        ...state,
        fetchOrder,
        resetPay,
        requestPay,
        setPaySuccess,
        failPayResult,
        fetchAllOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

const useOrderConsumer = () => {
  return useContext(OrderContext);
};

export { OrderProvider, initialState, useOrderConsumer };
