import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando o seed do banco de dados...");

  // 1. Limpeza do banco (ordem reversa de dependências)
  await prisma.appointment.deleteMany();
  await prisma.blockedTime.deleteMany();
  await prisma.businessHours.deleteMany();
  await prisma.service.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  // 2. Criar Usuária Admin (Ana Martins)
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Ana Martins",
      email: "ana.martins@dollynail.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log(`✅ Usuária Admin criada: ${admin.email}`);

  // 3. Criar Serviços Fictícios
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: "Manicure Tradicional",
        description:
          "Cutilagem e esmaltação tradicional com acabamento impecável.",
        price: 30.0,
        durationMin: 45,
      },
    }),
    prisma.service.create({
      data: {
        name: "Pedicure",
        description:
          "Tratamento completo para os pés, higienização, cutilagem e esmaltação.",
        price: 35.0,
        durationMin: 50,
      },
    }),
    prisma.service.create({
      data: {
        name: "Esmaltação em Gel",
        description:
          "Esmaltação de alta durabilidade com secagem imediata em cabine LED/UV.",
        price: 60.0,
        durationMin: 60,
      },
    }),
    prisma.service.create({
      data: {
        name: "Alongamento de Unhas",
        description:
          "Alongamento em gel/fibra de vidro com formato e tamanho personalizados.",
        price: 120.0,
        durationMin: 120,
      },
    }),
    prisma.service.create({
      data: {
        name: "Manutenção de Alongamento",
        description:
          "Preenchimento do crescimento, nivelamento e nova esmaltação.",
        price: 80.0,
        durationMin: 90,
      },
    }),
  ]);
  console.log(`✅ ${services.length} Serviços criados.`);

  // 4. Criar Clientes Fictícios
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: "Maria Silva",
        phone: "21988880001",
        email: "maria.silva@exemplo.com",
      },
    }),
    prisma.client.create({
      data: {
        name: "Juliana Souza",
        phone: "21988880002",
        email: "juliana.souza@exemplo.com",
      },
    }),
    prisma.client.create({
      data: {
        name: "Camila Oliveira",
        phone: "21988880003",
        email: "camila.oliveira@exemplo.com",
      },
    }),
    prisma.client.create({
      data: {
        name: "Beatriz Santos",
        phone: "21988880004",
        email: "beatriz.santos@exemplo.com",
      },
    }),
    prisma.client.create({
      data: {
        name: "Larissa Costa",
        phone: "21988880005",
        email: "larissa.costa@exemplo.com",
      },
    }),
  ]);
  console.log(`✅ ${clients.length} Clientes criados.`);

  // 5. Configurar Horários de Funcionamento (Terça a Sábado: 09:00 às 18:00)
  const businessHoursData = [
    { dayOfWeek: 0, isOpen: false, openTime: "00:00", closeTime: "00:00" }, // Domingo
    { dayOfWeek: 1, isOpen: false, openTime: "00:00", closeTime: "00:00" }, // Segunda
    { dayOfWeek: 2, isOpen: true, openTime: "09:00", closeTime: "18:00" }, // Terça
    { dayOfWeek: 3, isOpen: true, openTime: "09:00", closeTime: "18:00" }, // Quarta
    { dayOfWeek: 4, isOpen: true, openTime: "09:00", closeTime: "18:00" }, // Quinta
    { dayOfWeek: 5, isOpen: true, openTime: "09:00", closeTime: "18:00" }, // Sexta
    { dayOfWeek: 6, isOpen: true, openTime: "09:00", closeTime: "18:00" }, // Sábado
  ];

  for (const bh of businessHoursData) {
    await prisma.businessHours.create({ data: bh });
  }
  console.log("✅ Horários de funcionamento configurados.");

  console.log("🎉 Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante a execução do seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
