import { getSession } from 'next-auth/react';
import Product from '../../../models/productModels';
import * as database from '../../../utils/database';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('signin required');
  }

  const cartItems = req.body;
  await database.connectToDatabase();
  cartItems.map(async item => {
    await Product.findByIdAndUpdate(item._id, { $inc: { countInStock: -item.quantity } });
  });
  await database.disconnectDatabase();
  res.send('Success');
};

export default handler;
