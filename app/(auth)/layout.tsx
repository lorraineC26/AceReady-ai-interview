import { isAuthenticated } from "@/lib/actions/auth.action";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  // check if user is authenticated
  const isUserAuthenticated = await isAuthenticated();

  // if user is authenticated, redirect to home page
  if (isUserAuthenticated) {
    redirect("/");
  }

  return <div className="auth-layout">{children}</div>;
};

export default AuthLayout;
