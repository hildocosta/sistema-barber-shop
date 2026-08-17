import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// ==========================================
// 1. GET: Buscar dados / Agendamentos
// ==========================================
export async function GET(request) {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Não autorizado. Faça login para continuar." },
        { status: 401 }
      );
    }

    const clienteId = parseInt(session.user.id, 10);

    // Busca todos os agendamentos do usuário logado
    const agendamentos = await prisma.appointment.findMany({
      where: { clienteId },
      include: {
        filial: true,
        barbeiro: true,
        servicos: {
          include: {
            servico: true,
          },
        },
      },
      orderBy: {
        dataHora: "desc",
      },
    });

    return NextResponse.json(agendamentos, { status: 200 });
  } catch (error) {
    console.error("ERRO_AO_BUSCAR_AGENDAMENTOS:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar agendamentos." },
      { status: 500 }
    );
  }
}

// ==========================================
// 2. POST: Criar um Novo Agendamento
// ==========================================
export async function POST(request) {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Não autorizado. Faça login para continuar." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { dataHora, valorTotal, filialId, barbeiroId, observacao, servicos } = body;

    // Validação do Valor Total
    const parsedValorTotal = parseFloat(valorTotal);
    const finalValorTotal = isNaN(parsedValorTotal) ? 0 : parsedValorTotal;

    // Conversões de IDs
    const parsedClienteId = parseInt(session.user.id, 10);
    const parsedFilialId = parseInt(filialId, 10);

    const rawBarbeiroId = parseInt(barbeiroId, 10);
    const parsedBarbeiroId =
      !isNaN(rawBarbeiroId) && rawBarbeiroId > 0 ? rawBarbeiroId : null;

    if (isNaN(parsedFilialId)) {
      return NextResponse.json(
        { error: "Selecione uma filial válida." },
        { status: 400 }
      );
    }

    if (!dataHora) {
      return NextResponse.json(
        { error: "Data e horário inválidos." },
        { status: 400 }
      );
    }

    // Criação do agendamento com gravação da tabela pivô (AppointmentService)
    const agendamento = await prisma.appointment.create({
      data: {
        clienteId: parsedClienteId,
        filialId: parsedFilialId,
        barbeiroId: parsedBarbeiroId,
        dataHora: new Date(dataHora),
        valorTotal: finalValorTotal,
        observacao: observacao || null,
        status: "CONFIRMADO",

        servicos:
          Array.isArray(servicos) && servicos.length > 0
            ? {
                create: servicos.map((item) => ({
                  servicoId: parseInt(item.id, 10),
                  precoAplicado: parseFloat(item.preco) || 0,
                })),
              }
            : undefined,
      },
      include: {
        servicos: {
          include: {
            servico: true,
          },
        },
        filial: true,
        barbeiro: true,
      },
    });

    return NextResponse.json(agendamento, { status: 201 });
  } catch (error) {
    console.error("ERRO_AO_AGENDAR:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar o agendamento." },
      { status: 500 }
    );
  }
}