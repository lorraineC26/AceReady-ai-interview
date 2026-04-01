"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <Button onClick={handleSignOut} className="btn-secondary">
      Sign Out
    </Button>
  );
};

export default SignOutButton;
