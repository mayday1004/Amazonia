import React, { useReducer, useContext } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import catchErr from '../utils/error';
import reducer from './storeReducer';
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_CLEAR_ITEMS,
  SAVE_SHIPPING_ADDRESS,
  SAVE_PAYMENT_METHOD,
} from './action';

const cart = Cookies.get('cart');
const initialState = {
  cart: cart
    ? JSON.parse(cart)
    : {
        cartItems: [],
        shippingAddress: {
          fullName: '',
          address: '',
          city: '',
          postalCode: '',
          country: '',
        },
        paymentMethod: '',
      },
};

const StoreContext = React.createContext();
const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  const addToCartHandler = async product => {
    const existItem = state.cart.cartItems.find(x => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }

    dispatch({
      type: CART_ADD_ITEM,
      payload: { ...product, quantity },
    });
    toast.success('Product added to the cart');
  };

  const removeItemHandler = item => {
    dispatch({ type: CART_REMOVE_ITEM, payload: item });
  };

  const updateCartHandler = async (item, qty) => {
    const quantity = Number(qty);
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: CART_ADD_ITEM, payload: { ...item, quantity } });
    toast.success('Product updated in the cart');
  };

  const saveShippingAddress = ({ fullName, address, city, postalCode, country }) => {
    dispatch({
      type: SAVE_SHIPPING_ADDRESS,
      payload: { fullName, address, city, postalCode, country },
    });
    router.push('/payment');
  };

  const submitPaymentMethod = selectedPaymentMethod => {
    if (!selectedPaymentMethod) {
      return toast.error('Payment method is required');
    }
    dispatch({ type: SAVE_PAYMENT_METHOD, payload: selectedPaymentMethod });

    router.push('/placeorder');
  };

  const placeOrderHandler = async (
    setLoading,
    cartItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice
  ) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });

      setLoading(false);
      dispatch({ type: CART_CLEAR_ITEMS });
      Cookies.set(
        'cart',
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      );

      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      console.log(err);
      return toast.error(catchErr(err));
    }
  };

  return (
    <StoreContext.Provider
      value={{
        ...state,
        addToCartHandler,
        removeItemHandler,
        updateCartHandler,
        saveShippingAddress,
        submitPaymentMethod,
        placeOrderHandler,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

const useStoreConsumer = () => {
  return useContext(StoreContext);
};

export { StoreProvider, initialState, useStoreConsumer };
