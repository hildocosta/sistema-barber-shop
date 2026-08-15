import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// Sem o ": NextRequest" aqui:
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Você precisa estar logado para agendar." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    const { filialId, barbeiroId, servicosIds, dataHora, observacao } = await request.json();

    if (!filialId || !servicosIds || servicosIds.length === 0 || !dataHora) {
      return NextResponse.json(
        { error: "Dados incompletos para realizar o agendamento." },
        { status: 400 }
      );
    }

    const servicosDB = await prisma.service.findMany({
      where: { id: { in: servicosIds } },
    });

    const valorTotal = servicosDB.reduce(
      (acc, s) => acc + Number(s.preco),
      0
    );

    const novoAgendamento = await prisma.appointment.create({
      data: {
        clienteId: user.id,
        filialId: Number(filialId),
        barbeiroId: barbeiroId ? Number(barbeiroId) : null,
        dataHora: new Date(dataHora),
        valorTotal: valorTotal,
        observacao: observacao || null,
        servicos: {
          create: servicosDB.map((s) => ({
            servicoId: s.id,
            precoAplicado: s.preco,
          })),
        },
      },
      include: {
        servicos: {
          include: { servico: true },
        },
      },
    });

    return NextResponse.json(novoAgendamento, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor ao processar agendamento." },
      { status: 500 }
    );
  }
}