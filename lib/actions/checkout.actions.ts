"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { formatError } from "@/lib/utils";
import { paymentMethodSchema, shippingAddressSchema } from "@/lib/validator";
import { ShippingAddress } from "@/types";
import { cookies } from "next/headers";
import { z } from "zod";

// Save shipping address — works for both guest and logged-in
export async function saveShippingAddress(data: ShippingAddress) {
  try {
    const address = shippingAddressSchema.parse(data);
    const cookieStore = await cookies();

    // Always save to cookie (works for both)
    cookieStore.set("shippingAddress", JSON.stringify(address), {
      httpOnly: true,
      path: "/",
    });

    // Also save to DB if logged in
    const session = await auth();
    if (session?.user?.id) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { address },
      });
    }

    return { success: true, message: "Address saved" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Save payment method — works for both guest and logged-in
export async function savePaymentMethod(
  data: z.infer<typeof paymentMethodSchema>,
) {
  try {
    const { type } = paymentMethodSchema.parse(data);
    const cookieStore = await cookies();

    cookieStore.set("paymentMethod", type, { httpOnly: true, path: "/" });

    const session = await auth();
    if (session?.user?.id) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { paymentMethod: type },
      });
    }

    return { success: true, message: "Payment method saved" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get checkout data from cookies
export async function getCheckoutData() {
  const cookieStore = await cookies();

  const addressRaw = cookieStore.get("shippingAddress")?.value;
  const paymentMethod = cookieStore.get("paymentMethod")?.value ?? null;
  const address = addressRaw ? JSON.parse(addressRaw) : null;

  return { address, paymentMethod };
}
