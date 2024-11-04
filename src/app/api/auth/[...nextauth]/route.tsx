import NextAuth from "next-auth";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";

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
  //   async redirect({ url, baseUrl }: any) {
  //     return url.startsWith(baseUrl) ? url : `${baseUrl}/dashboard`;
  //   },
  // },
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };
