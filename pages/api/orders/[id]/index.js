import { getSession } from 'next-auth/react';
import Order from '../../../../models/orderModels';
import * as database from '../../../../utils/database';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('signin required');
  }

  await database.connectToDatabase();

  const order = await Order.findById(req.query.id);
  await database.disconnectDatabase();
  res.send(order);
};

export default handler;
