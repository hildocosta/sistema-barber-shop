import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// 1. Instancia o adaptador base do Prisma
const basePrismaAdapter = PrismaAdapter(prisma);

// 2. Adapta os métodos que recebem ID em String para converter para Int
const customAdapter = {
  ...basePrismaAdapter,
  getUser: (id) => {
    return prisma.user.findUnique({
      where: { id: typeof id === "string" ? parseInt(id, 10) : id },
    });
  },
  updateUser: ({ id, ...data }) => {
    return prisma.user.update({
      where: { id: typeof id === "string" ? parseInt(id, 10) : id },
      data,
    });
  },
  deleteUser: (id) => {
    return prisma.user.delete({
      where: { id: typeof id === "string" ? parseInt(id, 10) : id },
    });
  },
};

export const authOptions = {
  adapter: customAdapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };