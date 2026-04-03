import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../lib/generated/prisma";

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter }).$extends({
    result: {
      product: {
        price: {
          needs: { price: true },
          compute(
            product: Prisma.ProductGetPayload<{ select: { price: true } }>,
          ) {
            return product.price.toFixed(2); // "49.99" format for frontend display
          },
        },
        rating: {
          needs: { rating: true },
          compute(
            product: Prisma.ProductGetPayload<{ select: { rating: true } }>,
          ) {
            return product.rating.toString();
          },
        },
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
