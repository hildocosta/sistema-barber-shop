import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, senha, password } = body;

    const userEmail = (email || "").trim().toLowerCase();
    const userSenha = senha || password || "";

    // 1. Validações básicas de entrada
    if (!userEmail || !userSenha) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    // 2. Busca o usuário pelo e-mail no PostgreSQL
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos." },
        { status: 401 }
      );
    }

    // 3. Valida se o usuário possui senha cadastrada
    if (!user.senha) {
      return NextResponse.json(
        { error: "Usuário sem senha configurada. Crie uma nova conta." },
        { status: 400 }
      );
    }

    // 4. Compara a senha digitada com o Hash salvo no banco
    const isPasswordValid = await bcrypt.compare(userSenha, user.senha);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos." },
        { status: 401 }
      );
    }

    // 5. Formata os dados do usuário para o front-end (omitindo a senha por segurança)
    const userData = {
      id: user.id,
      name: user.nome,
      email: user.email,
      phone: user.telefone,
      role: user.role,
      isVip: user.isVip,
      criadoEm: user.criadoEm,
    };

    return NextResponse.json(
      {
        message: "Login realizado com sucesso!",
        user: userData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao realizar login." },
      { status: 500 }
    );
  }
}