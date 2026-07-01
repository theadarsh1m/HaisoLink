"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/validations/auth";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/dashboard-redirect",
      }, {
        onSuccess: () => {
          router.push("/dashboard-redirect");
        },
        onError: (ctx) => {
          setError(ctx.error.message || "Invalid credentials. Please try again.");
          setIsLoading(false);
        }
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1.5 text-center">
        <h1 className="text-xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to manage and track your deliveries
        </p>
      </div>

      {error && (
        <div className="p-3.5 text-sm rounded-xl bg-destructive/10 text-destructive border border-destructive/20 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/95">
            Email Address
          </label>
          <Input
            type="email"
            placeholder="name@example.com"
            {...register("email")}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/95">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            {...register("password")}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full py-5 rounded-xl font-bold" disabled={isLoading}>
          {isLoading ? <Loader size="sm" className="text-primary-foreground" /> : "Sign In"}
        </Button>
      </form>

      <div className="text-center text-sm font-medium text-muted-foreground mt-4">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
