import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();
    const { nome, email, telefone, senha, name, phone, password } = body;

    // Aceita tanto chaves em português quanto em inglês vindas do front
    const userNome = (nome || name || "").trim();
    const userEmail = (email || "").trim().toLowerCase();
    const userSenha = senha || password || "";
    const rawTelefone = telefone || phone || "";
    const cleanTelefone = rawTelefone.replace(/\D/g, "");

    // 1. Validações de campos essenciais
    if (!userNome) {
      return NextResponse.json(
        { error: "O nome completo é obrigatório." },
        { status: 400 }
      );
    }

    if (!userEmail || !userEmail.includes("@")) {
      return NextResponse.json(
        { error: "Informe um e-mail válido." },
        { status: 400 }
      );
    }

    if (!userSenha || userSenha.length < 6) {
      return NextResponse.json(
        { error: "A senha deve conter no mínimo 6 caracteres." },
        { status: 400 }
      );
    }

    // 2. Verifica se o e-mail já existe (constraint @unique)
    const existingUser = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este e-mail já está em uso por outro cliente." },
        { status: 409 }
      );
    }

    // 3. Criptografa a senha antes de gravar
    const hashedPassword = await bcrypt.hash(userSenha, 10);

    // 4. Criação no PostgreSQL via Prisma
    const novoUsuario = await prisma.user.create({
      data: {
        nome: userNome,
        email: userEmail,
        senha: hashedPassword,
        telefone: cleanTelefone || null,
        role: "CLIENT",
        isVip: false,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        role: true,
        isVip: true,
        criadoEm: true,
      },
    });

    // 5. Retorno formatado (mantém compatibilidade com o Header e localStorage)
    const userResponse = {
      id: novoUsuario.id,
      name: novoUsuario.nome,
      email: novoUsuario.email,
      phone: novoUsuario.telefone,
      role: novoUsuario.role,
      isVip: novoUsuario.isVip,
      criadoEm: novoUsuario.criadoEm,
    };

    return NextResponse.json(
      {
        message: "Cadastro realizado com sucesso!",
        user: userResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao registrar cliente:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao salvar cliente." },
      { status: 500 }
    );
  }
}