import Cookies from 'js-cookie';
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_RESET,
  CART_CLEAR_ITEMS,
  SAVE_SHIPPING_ADDRESS,
  SAVE_PAYMENT_METHOD,
} from './action';

const reducer = (state, action) => {
  if (action.type === CART_ADD_ITEM) {
    const newItem = action.payload;
    const existItem = state.cart.cartItems.find(item => item.slug === newItem.slug);
    const cartItems = existItem
      ? state.cart.cartItems.map(item => (item.name === existItem.name ? newItem : item))
      : [...state.cart.cartItems, newItem];

    Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }));
    return { ...state, cart: { ...state.cart, cartItems } };
  }
  if (action.type === CART_REMOVE_ITEM) {
    const cartItems = state.cart.cartItems.filter(item => item.slug !== action.payload.slug);

    Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }));
    return { ...state, cart: { ...state.cart, cartItems } };
  }

  if (action.type === CART_RESET) {
    Cookies.remove('cart');
    return {
      ...state.cart,
      cartItems: [],
      shippingAddress: {},
      paymentMethod: '',
    };
  }
  if (action.type === CART_CLEAR_ITEMS) {
    return { ...state, cart: { ...state.cart, cartItems: [] } };
  }
  if (action.type === SAVE_SHIPPING_ADDRESS) {
    Cookies.set(
      'cart',
      JSON.stringify({
        ...state.cart,
        shippingAddress: {
          ...state.cart.shippingAddress,
          ...action.payload,
        },
      })
    );
    return {
      ...state,
      cart: {
        ...state.cart,
        shippingAddress: {
          ...state.cart.shippingAddress,
          ...action.payload,
        },
      },
    };
  }

  if (action.type === SAVE_PAYMENT_METHOD) {
    Cookies.set(
      'cart',
      JSON.stringify({
        ...state.cart,
        paymentMethod: action.payload,
      })
    );
    return {
      ...state,
      cart: {
        ...state.cart,
        paymentMethod: action.payload,
      },
    };
  }
  throw new Error(`no such action :${action.type}`);
};

export default reducer;
