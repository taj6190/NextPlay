/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { formatError } from "@/lib/utils";
import { PAGE_SIZE } from "@/types";
import { cookies } from "next/headers";
import { getMyCart } from "./cart.actions";
import { getCheckoutData } from "./checkout.actions";

export async function createOrder() {
  try {
    const session = await auth();
    const userId = session?.user?.id ?? null;

    const cart = await getMyCart();
    if (!cart || cart.items.length === 0) {
      return { success: false, message: "Cart is empty" };
    }

    const { address, paymentMethod } = await getCheckoutData();
    if (!address) {
      return { success: false, message: "Shipping address is required" };
    }
    if (!paymentMethod) {
      return { success: false, message: "Payment method is required" };
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: userId,
        shippingAddress: address,
        paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
        orderItems: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            slug: item.slug,
            image: item.image,
            price: item.price,
            qty: item.qty,
          })),
        },
      },
    });

    // Clear cart after order
    await prisma.cart.delete({ where: { id: cart.id } });

    const cookieStore = await cookies();

    // Save orderId to cookie for guest access
    cookieStore.set("lastOrderId", order.id, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    // Clear checkout cookies
    cookieStore.delete("shippingAddress");
    cookieStore.delete("paymentMethod");

    return {
      success: true,
      message: "Order placed successfully",
      orderId: order.id,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getOrderById(id: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { id },
      include: {
        orderItems: true,
        user: { select: { name: true, email: true } },
      },
    });
    return order;
  } catch (error) {
    return null;
  }
}

export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { data: [], totalPages: 0 };
    }

    const userId = session.user.id;

    const data = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    });

    const dataCount = await prisma.order.count({
      where: { userId },
    });

    return {
      data,
      totalPages: Math.ceil(dataCount / limit),
    };
  } catch (error) {
    return { data: [], totalPages: 0 };
  }
}
