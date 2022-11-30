import bcryptjs from 'bcryptjs';
import User from '../../../models/userModels';
import * as database from '../../../utils/database';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }
  const { name, email, password } = req.body;

  if (!name || !email || !email.includes('@') || !password || password.trim().length < 5) {
    res.status(422).json({
      message: 'Validation error',
    });
    return;
  }

  await database.connectToDatabase();

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    res.status(422).json({ message: 'User exists already!' });
    await database.disconnectDatabase();
    return;
  }

  const newUser = new User({
    name,
    email,
    password: bcryptjs.hashSync(password),
    isAdmin: false,
  });

  const user = await newUser.save();
  await database.disconnectDatabase();
  res.status(201).send({
    message: 'Created user!',
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
}

export default handler;
