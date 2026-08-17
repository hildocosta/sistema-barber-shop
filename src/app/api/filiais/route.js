import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. Rota para BUSCAR as filiais (Resolve o erro 405!)
export async function GET() {
  try {
    const filiais = await prisma.branch.findMany({
      orderBy: {
        nome: "asc", // Ordena por nome de A a Z
      },
    });

    return NextResponse.json(filiais, { status: 200 });
  } catch (error) {
    console.error("ERRO_AO_BUSCAR_FILIAIS:", error);
    return NextResponse.json(
      { error: "Erro ao buscar filiais." },
      { status: 500 }
    );
  }
}

// 2. Rota para CRIAR uma nova filial (Seu código original)
export async function POST(request) {
  try {
    const body = await request.json();
    const { nome, endereco, telefone } = body;

    if (!nome || !endereco) {
      return NextResponse.json(
        { error: "Nome e Endereço são obrigatórios." },
        { status: 400 }
      );
    }

    const filial = await prisma.branch.create({
      data: {
        nome,
        endereco,
        telefone: telefone || null,
      },
    });

    return NextResponse.json(filial, { status: 201 });
  } catch (error) {
    console.error("ERRO_AO_CRIAR_FILIAL:", error);
    return NextResponse.json(
      { error: "Erro ao cadastrar filial." },
      { status: 500 }
    );
  }
}