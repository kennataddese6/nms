import Link from "next/link";
import Image from "next/image";

import { Command } from "lucide-react";

import { LoginForm } from "../../_components/login-form";
import { GoogleButton } from "../../_components/social-auth/google-button";

export default function LoginV1() {
  return (
    <div className="flex h-dvh">
      <div className="hidden lg:block lg:w-1/3 relative overflow-hidden bg-neutral-100 border-r">
        <Image
          src="/images/about-nursery.png"
          alt="Bubbly Day Nursery illustration"
          fill
          className="object-cover animate-fade-in"
          sizes="33vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent mix-blend-multiply" />
      </div>

      <div className="flex w-full items-center justify-center bg-background p-8 lg:w-2/3">
        <div className="w-full max-w-md space-y-10 py-24 lg:py-32">
          <div className="space-y-4 text-center">
            <div className="font-medium tracking-tight">Login</div>
            <div className="mx-auto max-w-xl text-muted-foreground">
              Welcome back. Enter your email and password, let&apos;s hope you remember them this time.
            </div>
          </div>
          <div className="space-y-4">
            <LoginForm />
            <GoogleButton className="w-full" variant="outline" />
            <p className="text-center text-muted-foreground text-xs">
              Don&apos;t have an account?{" "}
              <Link prefetch={false} href="register" className="text-primary">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
