import { getSession } from 'next-auth/react';
import bcryptjs from 'bcryptjs';
import User from '../../../models/userModels';
import * as database from '../../../utils/database';

async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'signin required' });
  }

  const { user } = session;
  const { name, email, password } = req.body;

  if (!name || !email || !email.includes('@') || (password && password.trim().length < 5)) {
    res.status(422).json({
      message: 'Validation error',
    });
    return;
  }

  await database.connectToDatabase();
  const toUpdateUser = await User.findById(user._id);
  toUpdateUser.name = name;
  toUpdateUser.email = email;

  if (password) {
    toUpdateUser.password = bcryptjs.hashSync(password);
  }

  await toUpdateUser.save();
  await database.disconnectDatabase();
  res.send({
    message: 'User updated',
  });
}

export default handler;
