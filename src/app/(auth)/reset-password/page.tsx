"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordInput } from "@/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";

export default function ResetPasswordPage() {
  const [success, setSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
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
        <h1 className="text-xl font-bold tracking-tight">Reset Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password below to update your account access
        </p>
      </div>

      {success ? (
        <div className="space-y-4">
          <div className="p-4 text-sm rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-medium">
            Password reset successful! You can now log in with your new password.
          </div>
          <Link href="/login">
            <Button className="w-full font-bold">Sign In</Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/95">
              New Password
            </label>
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

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/95">
              Confirm Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive font-medium">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full py-5 rounded-xl font-bold" disabled={isLoading}>
            {isLoading ? <Loader size="sm" className="text-primary-foreground" /> : "Reset Password"}
          </Button>
        </form>
      )}
    </div>
  );
}
