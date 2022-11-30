import React, { useReducer, useContext } from 'react';
import { signIn, signOut } from 'next-auth/react';
import { toast } from 'react-toastify';
import axios from 'axios';
import catchErr from '../utils/error';
import reducer from './storeReducer';
import { CART_RESET } from './action';

const initialState = {};

const AuthContext = React.createContext();
const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const credentialsRegister = async ({ name, email, password }) => {
    try {
      await axios.post('/api/auth/signup', {
        name,
        email,
        password,
      });

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(catchErr(err));
    }
  };

  const credentialsLogin = async ({ email, password }) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(catchErr(err));
    }
  };

  const googleLogin = async e => {
    e.preventDefault();
    try {
      const result = await signIn('google', {
        callbackUrl: process.env.NEXTAUTH_URL,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(catchErr(err));
    }
  };

  const logout = () => {
    signOut({ callbackUrl: '/login' });
    dispatch({ type: CART_RESET });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        credentialsLogin,
        googleLogin,
        credentialsRegister,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuthConsumer = () => {
  return useContext(AuthContext);
};

export { AuthProvider, initialState, useAuthConsumer };
