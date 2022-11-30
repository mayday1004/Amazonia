import User from '../../models/userModels';
import Product from '../../models/productModels';
import data from '../../utils/data';
import * as database from '../../utils/database';

const handler = async (req, res) => {
  await database.connectToDatabase();
  await User.deleteMany();
  await User.insertMany(data.users);
  await Product.deleteMany();
  await Product.insertMany(data.products);
  await database.disconnectDatabase();
  res.send({ message: 'seeded successfully' });
};

export default handler;
