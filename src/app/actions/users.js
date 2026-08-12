"use server";

import { prisma } from "@/lib/prisma";

export async function registerQuickUser(formData) {
  try {
    const nome = formData.get("nome")?.toString().trim();
    const email = formData.get("email")?.toString().trim().toLowerCase();
    const telefone = formData.get("telefone")?.toString().trim();

    if (!nome || !email) {
      return { success: false, error: "Nome e E-mail são obrigatórios." };
    }

    // Verifica unicidade do email conforme o schema
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return { success: false, error: "Este e-mail já está cadastrado. Tente entrar." };
    }

    const newUser = await prisma.user.create({
      data: {
        nome,
        email,
        telefone: telefone || null,
        role: "CLIENT",
        isVip: false,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        isVip: true,
        role: true,
      },
    });

    return { success: true, user: newUser };
  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    return { success: false, error: "Não foi possível criar a conta. Tente novamente." };
  }
}