import { createRequire } from "module";
const require = createRequire(import.meta.url);

const bcrypt = require("bcryptjs");
const { PrismaNeonHttp } = require("@prisma/adapter-neon");
const { PrismaClient } = require("../src/generated/prisma/index.js");

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("חסר DATABASE_URL"); process.exit(1); }

const adapter = new PrismaNeonHttp(DATABASE_URL, {});
const prisma = new PrismaClient({ adapter });

const email = process.argv[2] || "admin@reshet.co";
const password = process.argv[3] || "admin123";
const name = process.argv[4] || "שדכנית";

const hash = bcrypt.hashSync(password, 10);

try {
  const user = await prisma.user.create({ data: { email, password: hash, name } });
  console.log(`✅ נוצר משתמש: ${user.email}`);
} catch (e) {
  if (e.code === "P2002") console.log("⚠️  המשתמש כבר קיים");
  else throw e;
} finally {
  await prisma.$disconnect();
}
