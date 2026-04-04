// app/user/profile/page.tsx
import { auth } from "@/auth";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";
import ProfileForm from "./profile-form";

export const metadata: Metadata = {
  title: "Customer Profile",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="h2-bold text-2xl font-bold">Profile</h2>
      {/* Wrap in SessionProvider so useSession() works inside ProfileForm.
          We pass the server-fetched session to 'session' prop to avoid hydration mismatch.
      */}
      <SessionProvider session={session}>
        <ProfileForm />
      </SessionProvider>
    </div>
  );
}
