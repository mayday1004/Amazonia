import { getSession } from 'next-auth/react';
import Order from '../../../models/orderModels';
import * as database from '../../../utils/database';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'signin required' });
  }
  const { user } = session;
  await database.connectToDatabase();
  const orders = await Order.find({ user: user._id });
  await database.disconnectDatabase();
  res.send(orders);
};

export default handler;
