import { getSession } from 'next-auth/react';
import Product from '../../../../models/productModels';
import * as database from '../../../../utils/database';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send('admin signin required');
  }
  // const { user } = session;
  if (req.method === 'GET') {
    return getHandler(req, res);
  } else if (req.method === 'POST') {
    return postHandler(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

const postHandler = async (req, res) => {
  await database.connectToDatabase();
  const newProduct = new Product({
    name: 'sample name',
    slug: 'sample-name-' + Math.random(),
    image: '/images/shirt1.jpg',
    price: 0,
    category: 'sample category',
    brand: 'sample brand',
    countInStock: 0,
    description: 'sample description',
    rating: 0,
    numReviews: 0,
  });

  const product = await newProduct.save();
  await database.disconnectDatabase();
  res.send({ message: 'Product created successfully', product });
};

const getHandler = async (req, res) => {
  await database.connectToDatabase();
  const products = await Product.find({});
  await database.disconnectDatabase();
  res.send(products);
};
export default handler;