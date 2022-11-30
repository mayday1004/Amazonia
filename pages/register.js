import Link from 'next/link';
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { useAuthConsumer } from '../context/authContext';

export default function LoginScreen() {
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();
  const { googleLogin, credentialsRegister } = useAuthConsumer();
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);

  return (
    <Layout title='Create Account'>
      <form className='mx-auto max-w-screen-md'>
        <h1 className='mb-4 text-xl'>Create Account</h1>
        <div className='mb-4'>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            className='w-full'
            id='name'
            autoFocus
            {...register('name', {
              required: 'Please enter name',
            })}
          />
          {errors.name && <div className='text-red-500'>{errors.name.message}</div>}
        </div>

        <div className='mb-4'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            {...register('email', {
              required: 'Please enter email',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'Please enter valid email',
              },
            })}
            className='w-full'
            id='email'
          ></input>
          {errors.email && <div className='text-red-500'>{errors.email.message}</div>}
        </div>
        <div className='mb-4'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            {...register('password', {
              required: 'Please enter password',
              minLength: { value: 6, message: 'password is more than 5 chars' },
            })}
            className='w-full'
            id='password'
            autoFocus
          ></input>
          {errors.password && <div className='text-red-500 '>{errors.password.message}</div>}
        </div>
        <div className='mb-4'>
          <label htmlFor='confirmPassword'>Confirm Password</label>
          <input
            className='w-full'
            type='password'
            id='confirmPassword'
            {...register('confirmPassword', {
              required: 'Please enter confirm password',
              validate: value => value === getValues('password'),
              minLength: {
                value: 6,
                message: 'confirm password is more than 5 chars',
              },
            })}
          />
          {errors.confirmPassword && <div className='text-red-500 '>{errors.confirmPassword.message}</div>}
          {errors.confirmPassword && errors.confirmPassword.type === 'validate' && (
            <div className='text-red-500 '>Password do not match</div>
          )}
        </div>
        <div className='flex justify-between mb-4'>
          <button
            type='button'
            className='text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2'
            onClick={googleLogin}
          >
            <svg
              className='mr-2 -ml-1 w-4 h-4'
              aria-hidden='true'
              focusable='false'
              data-prefix='fab'
              data-icon='google'
              role='img'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 488 512'
            >
              <path
                fill='currentColor'
                d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z'
              ></path>
            </svg>
            Register with Google
          </button>
          <button className='primary-button' onClick={handleSubmit(credentialsRegister)}>
            Register
          </button>
        </div>
        <div className='mb-4 '>
          Already have an account? &nbsp;
          <Link href={`/login?redirect=${redirect || '/'}`}>Login</Link>
        </div>
      </form>
    </Layout>
  );
}
