import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../components/Layout';
import * as database from '../../utils/database';
import { useStoreConsumer } from '../../context/storeContext';
import Product from '../../models/productModels';

const ProductDetail = ({ product }) => {
  const { addToCartHandler } = useStoreConsumer();

  if (!product) {
    return <Layout title='Produt Not Found'>Produt Not Found</Layout>;
  }

  return (
    <Layout title={product.name}>
      <div className='py-2'>
        <Link href='/'>back to products</Link>
      </div>
      <div className='grid md:grid-cols-4 md:gap-3'>
        <div className='md:col-span-2'>
          <Image src={product.image} alt={product.name} width={640} height={640}></Image>
        </div>
        <div>
          <ul>
            <li>
              <h1 className='text-lg'>{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>
        <div>
          <div className='card p-5'>
            <div className='mb-2 flex justify-between'>
              <div>Price</div>
              <div>${product.price}</div>
            </div>
            <div className='mb-2 flex justify-between'>
              <div>Status</div>
              <div>{product.countInStock > 0 ? 'In stock' : 'Unavailable'}</div>
            </div>
            <button className='primary-button w-full' onClick={() => addToCartHandler(product)}>
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await database.connectToDatabase();
  const product = await Product.findOne({ slug }).lean();
  await database.disconnectDatabase();
  return {
    props: {
      product: product ? database.convertDocToObj(product) : null,
    },
  };
}
