import Product from '../../../models/productModels';
import * as database from '../../../utils/database';

const handler = async (req, res) => {
  await database.connectToDatabase();
  const product = await Product.findById(req.query.id);
  await database.disconnectDatabase();
  res.send(product);
};

export default handler;
