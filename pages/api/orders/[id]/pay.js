import { getSession } from 'next-auth/react';
import Order from '../../../../models/orderModels';
import * as database from '../../../../utils/database';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('Error: signin required');
  }

  await database.connectToDatabase();
  const order = await Order.findById(req.query.id);
  if (order) {
    if (order.isPaid) {
      return res.status(400).send({ message: 'Error: order is already paid' });
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      email_address: req.body.email_address,
    };
    const paidOrder = await order.save();
    await database.disconnectDatabase();
    res.send({ message: 'order paid successfully', order: paidOrder });
  } else {
    await database.disconnectDatabase();
    res.status(404).send({ message: 'Error: order not found' });
  }
};

export default handler;
