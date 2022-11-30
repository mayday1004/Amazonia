import { getSession } from 'next-auth/react';
import User from '../../../../models/userModels';
import * as database from '../../../../utils/database';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send('admin signin required');
  }
  await database.connectToDatabase();
  const users = await User.find({});
  await database.disconnectDatabase();
  res.send(users);
};

export default handler;
