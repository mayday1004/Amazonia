import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import { Menu } from '@headlessui/react';
import 'react-toastify/dist/ReactToastify.css';
import { useStoreConsumer } from '../context/storeContext';
import { useAuthConsumer } from '../context/authContext';

const Layout = ({ title, children }) => {
  const { cart } = useStoreConsumer();
  const { logout } = useAuthConsumer();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const { status, data: session } = useSession();

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart]);
  return (
    <>
      <Head>
        <title>{title ? title + ' - Amazonia' : 'Amazonia'}</title>
        <meta name='description' content='Ecommerce Website Project with Next.js' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <ToastContainer position='bottom-center' limit={1} />
      <div className='flex min-h-screen flex-col justify-between'>
        <header>
          <nav className='flex h-12 items-center px-4 justify-between shadow-md'>
            <Link href='/' legacyBehavior>
              <a className='text-lg font-bold'>amazonia</a>
            </Link>
            <div>
              <Link href='/cart' legacyBehavior>
                <a className='p-2'>
                  Cart
                  {cartItemsCount > 0 && (
                    <span className='ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white'>
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link>
              {status === 'loading' ? (
                'Loading'
              ) : session?.user ? (
                <Menu as='div' className='relative inline-block'>
                  <Menu.Button className='text-blue-600'>{session.user.name}</Menu.Button>
                  <Menu.Items className='absolute right-0 w-56 origin-top-right bg-white  shadow-lg '>
                    <Menu.Item>
                      <Link href='/profile' legacyBehavior>
                        <a className='dropdown-link'>Profile</a>
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link href='/order-history' legacyBehavior>
                        <a className='dropdown-link'>Order History</a>
                      </Link>
                    </Menu.Item>
                    {session.user.isAdmin && (
                      <Menu.Item>
                        <Link href='/admin/dashboard' legacyBehavior>
                          <a className='dropdown-link'>Admin Dashboard</a>
                        </Link>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <a className='dropdown-link' href='#' onClick={logout}>
                        Logout
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href='/login' legacyBehavior>
                  <a className='p-2'>Login</a>
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className='container m-auto mt-4 px-4'>{children}</main>
        <footer className='flex h-10 justify-center items-center shadow-inner'>
          Copyright © 2022 Amazonia
        </footer>
      </div>
    </>
  );
};

export default Layout;
