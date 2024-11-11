import NextAuth from "next-auth";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";

const options = {
  providers: [
    Facebook({
      clientId: process.env.NEXT_PUBLIC_FACEBOOK_ID ?? "",
      clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_SECRET ?? "",
    }),
    Google({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_ID ?? "",
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET ?? "",
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
