import { getSession } from 'next-auth/react';
import Order from '../../../models/orderModels';
import * as database from '../../../utils/database';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send('signin required');
  }
  if (req.method === 'GET') {
    await database.connectToDatabase();
    const orders = await Order.find({}).populate('user', 'name');
    await database.disconnectDatabase();
    res.send(orders);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export default handler;
