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

const reducer = (state, action) => {
  if (action.type === FETCH_REQUEST) {
    return { ...state, loading: true, error: '' };
  }
  if (action.type === FETCH_ORDER_SUCCESS) {
    return { ...state, loading: false, order: action.payload, error: '' };
  }
  if (action.type === FETCH_ORDERS_SUCCESS) {
    return { ...state, loading: false, orders: action.payload, error: '' };
  }
  if (action.type === FETCH_FAIL) {
    return { ...state, loading: false, error: action.payload };
  }
  if (action.type === PAY_REQUEST) {
    return { ...state, loadingPay: true };
  }
  if (action.type === PAY_SUCCESS) {
    return { ...state, loadingPay: false, successPay: true };
  }
  if (action.type === PAY_FAIL) {
    return { ...state, loadingPay: false, errorPay: action.payload };
  }
  if (action.type === PAY_RESET) {
    return { ...state, loadingPay: false, successPay: false, errorPay: '' };
  }

  throw new Error(`no such action :${action.type}`);
};

export default reducer;
