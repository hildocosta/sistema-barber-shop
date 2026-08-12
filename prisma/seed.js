import path from "node:path";
import dotenv from "dotenv";
import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Carrega .env e .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

const { PrismaClient } = pkg;
const { Pool } = pg;

// Usa DIRECT_URL para scripts diretos/seed ou cai para DATABASE_URL
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error("ERRO: Nenhuma URL de banco encontrada no .env!");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Iniciando seed no Neon...");

  // 1. Limpar registros anteriores
  await prisma.appointmentService.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();
  await prisma.branch.deleteMany();

  // 2. Criar Filiais
  await prisma.branch.create({
    data: {
      nome: "Unidade Central - Boneca do Iguaçu",
      endereco: "Av. Castro Alves, 445",
      telefone: "(41) 99280-2437",
    },
  });

  await prisma.branch.create({
    data: {
      nome: "Unidade Shopping Boulevard",
      endereco: "Av. das Américas, 1200 - Piso L2",
      telefone: "(41) 99999-8888",
    },
  });

  // 3. Criar Barbeiros e Cliente Inicial
  await prisma.user.createMany({
    data: [
      {
        nome: "Gustavo Mendes",
        email: "gustavo@barbershop.com",
        telefone: "(41) 99111-1111",
        role: "BARBER",
        cargo: "Mestre Barbeiro",
        badge: "Destaque",
      },
      {
        nome: "Guilherme Santos",
        email: "guilherme@barbershop.com",
        telefone: "(41) 99222-2222",
        role: "BARBER",
        cargo: "Especialista em Degradê",
        badge: null,
      },
      {
        nome: "Fabio Oliveira",
        email: "fabio@barbershop.com",
        telefone: "(41) 99333-3333",
        role: "BARBER",
        cargo: "Visagista & Barboterapia",
        badge: "Destaque",
      },
      {
        nome: "Cliente Teste",
        email: "cliente@teste.com",
        telefone: "(41) 98888-7777",
        role: "CLIENT",
        isVip: false,
      },
    ],
  });

  // 4. Criar Serviços do Catálogo
  await prisma.service.createMany({
    data: [
      { nome: "Corte Tradicional / Fade", preco: 35.0, precoOriginal: 40.0, duracaoMinutos: 30 },
      { nome: "Barba Terapia Completa", preco: 30.0, precoOriginal: 35.0, duracaoMinutos: 30 },
      { nome: "Combo Cabelo + Barba", preco: 60.0, precoOriginal: 75.0, duracaoMinutos: 60 },
      { nome: "Sobrancelha na Navalha", preco: 12.0, precoOriginal: 15.0, duracaoMinutos: 15 },
      { nome: "Acabamento & Pezinho", preco: 15.0, precoOriginal: 18.0, duracaoMinutos: 15 },
      { nome: "Limpeza de Pele Black Mask", preco: 45.0, precoOriginal: 50.0, duracaoMinutos: 30 },
    ],
  });

  console.log("Banco Neon populado com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro durante o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });