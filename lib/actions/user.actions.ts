"use server";

import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/db/prisma";
import { ShippingAddress } from "@/types";
import { hashSync } from "bcrypt-ts-edge";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";
import { formatError } from "../utils";
import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
} from "../validator";

// Sign in the user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    await signIn("credentials", user);
    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: "Invalid email or password" };
  }
}

// Sign out user
export async function SignOutUser() {
  await signOut({ redirectTo: "/" });
}

// Register a new user
export async function signUp(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      confirmPassword: formData.get("confirmPassword"),
      password: formData.get("password"),
    });

    const plainPassword = user.password;
    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: "User created successfully" };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: formatError(error) };
  }
}

// Get user by ID
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  if (!user) throw new Error("User not found");
  return user;
}

// Update user address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();
    const address = shippingAddressSchema.parse(data);

    if (session?.user?.id) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { address },
      });
    }

    return { success: true, message: "Address saved successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update user payment method
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("User not authenticated");

    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { paymentMethod: paymentMethod.type },
    });

    return { success: true, message: "Payment method updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update user profile
export async function updateProfile(user: { name: string; email: string }) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("User not authenticated");

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: user.name },
    });

    return { success: true, message: "User updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
