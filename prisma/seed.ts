import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@maxa.com";
  const password = "Admin123!";

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: Role.ADMIN },
    create: {
      name: "Admin",
      email,
      password: hashedPassword,
      role: Role.ADMIN,
      active: true,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  console.log("✅ Admin creado:", admin);
  console.log("👉 Login:", { email, password });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
