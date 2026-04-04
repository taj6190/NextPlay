/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [],
  callbacks: {
    authorized({ request, auth }: any) {
      const protectedPaths = [/\/profile/, /\/admin/];
      const { pathname } = request.nextUrl;

      if (protectedPaths.some((p) => p.test(pathname)) && !auth) {
        return Response.redirect(
          new URL(`/sign-in?callbackUrl=${pathname}`, request.url),
        );
      }

      if (!request.cookies.get("sessionCartId")) {
        const sessionCartId = crypto.randomUUID();
        const response = NextResponse.next();
        response.cookies.set("sessionCartId", sessionCartId);
        return response;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
