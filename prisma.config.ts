import path from "path";
import type { PrismaConfig } from "prisma";

export default {
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),
  migrate: {
    async adapter() {
      const { PrismaNeon } = await import("@prisma/adapter-neon");
      return new PrismaNeon({ connectionString: process.env.DATABASE_URL });
    },
  },
} satisfies PrismaConfig;