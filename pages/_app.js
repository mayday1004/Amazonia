import { StoreProvider } from '../context/storeContext';
import { OrderProvider } from '../context/orderContext';
import { AuthProvider } from '../context/authContext';
import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <StoreProvider>
          <OrderProvider>
            <PayPalScriptProvider deferLoading={true}>
              {Component.auth ? (
                <Auth adminOnly={Component.auth.adminOnly}>
                  <Component {...pageProps} />
                </Auth>
              ) : (
                <Component {...pageProps} />
              )}
            </PayPalScriptProvider>
          </OrderProvider>
        </StoreProvider>
      </AuthProvider>
    </SessionProvider>
  );
}

function Auth({ children, adminOnly }) {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/unauthorized?message=login required');
    },
  });
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  if (adminOnly && !session.user.isAdmin) {
    router.push('/unauthorized?message=admin login required');
  }

  return children;
}

export default MyApp;
