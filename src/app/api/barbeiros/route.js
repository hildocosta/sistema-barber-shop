import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const { nome, email, senha, telefone, cargo, badge } = body;

    // Validação dos campos obrigatórios do Schema
    if (!nome || !email || !senha) {
      return NextResponse.json(
        { error: "Nome, e-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const emailTrim = email.trim().toLowerCase();

    // Verifica se já existe um usuário com esse e-mail
    const userExists = await prisma.user.findUnique({
      where: { email: emailTrim },
    });

    if (userExists) {
      return NextResponse.json(
        { error: "Já existe um usuário cadastrado com este e-mail." },
        { status: 400 }
      );
    }

    // Cria o Barbeiro
    const barbeiro = await prisma.user.create({
      data: {
        nome: nome.trim(),
        name: nome.trim(), // Compatibilidade NextAuth / OAuth
        email: emailTrim,
        senha: senha.trim(), // Nota: Em produção, considere aplicar hash (ex: bcrypt)
        telefone: telefone ? telefone.trim() : null,
        cargo: cargo ? cargo.trim() : "Barbeiro",
        badge: badge ? badge.trim() : null,
        role: "BARBER", // Define explicitamente como barbeiro
      },
    });

    return NextResponse.json(barbeiro, { status: 201 });
  } catch (error) {
    console.error("ERRO_AO_CRIAR_BARBEIRO:", error);
    return NextResponse.json(
      { error: "Erro ao cadastrar barbeiro." },
      { status: 500 }
    );
  }
}