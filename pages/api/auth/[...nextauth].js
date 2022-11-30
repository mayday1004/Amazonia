import bcryptjs from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import User from '../../../models/userModels';
import * as database from '../../../utils/database';

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) token._id = user._id;
      if (user?.isAdmin) token.isAdmin = user.isAdmin;
      return token;
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id;
      if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await database.connectToDatabase();
        const user = await User.findOne({
          email: credentials.email,
        });
        await database.disconnectDatabase();
        if (user && bcryptjs.compareSync(credentials.password, user.password)) {
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: 'f',
            isAdmin: user.isAdmin,
          };
        }
        throw new Error('Invalid email or password');
      },
    }),
    GoogleProvider({
      clientId: process.env.GAUTH_CLIENT_ID,
      clientSecret: process.env.GAUTH_CLIENT_SECRET,
      async profile(profile) {
        try {
          await database.connectToDatabase();
          const user = await User.findOne({
            email: profile.email,
          });
          if (!user) {
            const newUser = await User.create({
              name: profile.name,
              email: profile.email,
              password: bcryptjs.hashSync(Math.random().toString(36).slice(-8)),
            });
            return newUser;
          }
          return user;
        } catch (error) {
          console.log('---------');
        }
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
});
