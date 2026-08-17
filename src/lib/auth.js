import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const basePrismaAdapter = PrismaAdapter(prisma);

const customAdapter = {
  ...basePrismaAdapter,
  getUser: (id) => {
    if (!id) return null;
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

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("E-mail e senha são obrigatórios.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("E-mail ou senha incorretos.");
        }

        // Verifica o campo 'senha' do seu schema Prisma
        const storedPassword = user.senha || user.password;

        if (!storedPassword) {
          throw new Error("Usuário cadastrado pelo Google. Acesse com o botão do Google.");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          storedPassword
        );

        if (!isPasswordValid) {
          throw new Error("E-mail ou senha incorretos.");
        }

        return {
          id: user.id,
          name: user.nome || user.name,
          email: user.email,
          role: user.role,
        };
      },
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
      if (token && session.user) {
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

export function getSession() {
  return getServerSession(authOptions);
}