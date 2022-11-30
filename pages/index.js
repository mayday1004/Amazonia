import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import * as database from '../utils/database';
import { useStoreConsumer } from '../context/storeContext';
import Product from '../models/productModels';

export default function Home({ products }) {
  const { addToCartHandler } = useStoreConsumer();

  return (
    <Layout title='Home page'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {products.map(product => (
          <ProductCard product={product} addToCartHandler={addToCartHandler} key={product.slug}></ProductCard>
        ))}
      </div>
    </Layout>
  );
}

//首頁預先載入資料庫所有商品
export async function getServerSideProps() {
  await database.connectToDatabase();
  const products = await Product.find().lean();
  return {
    props: {
      products: products.map(database.convertDocToObj),
    },
  };
}
