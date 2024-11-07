import NextAuth from "next-auth";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import { signIn } from "next-auth/react";

const options = {
  providers: [
    Facebook({
      clientId: process.env.FACEBOOK_ID ?? "",
      clientSecret: process.env.FACEBOOK_SECRET ?? "",
    }),
    Google({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
  ],

  // callbacks: {
  //   async signIn({ user, account, profile }: any) {
  //     const isNewUser = await checkIfUserExists(user.email);
  //   },
  // },
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };
