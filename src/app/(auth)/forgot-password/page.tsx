"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";

export default function ForgotPasswordPage() {
  const [success, setSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async () => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setSuccess(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1.5 text-center">
        <h1 className="text-xl font-bold tracking-tight">Forgot Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a link to reset your password
        </p>
      </div>

      {success ? (
        <div className="space-y-4">
          <div className="p-4 text-sm rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-medium">
            Reset email sent! Please check your inbox for instructions.
          </div>
          <Link href="/login">
            <Button className="w-full font-bold">Back to Login</Button>
          </Link>
        </div>
      ) : (
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

          <Button type="submit" className="w-full py-5 rounded-xl font-bold" disabled={isLoading}>
            {isLoading ? <Loader size="sm" className="text-primary-foreground" /> : "Send Reset Link"}
          </Button>

          <div className="text-center text-sm font-medium text-muted-foreground mt-4">
            Remember your password?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
