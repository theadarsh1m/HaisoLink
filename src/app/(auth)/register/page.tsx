"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/validations/auth";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "CUSTOMER",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);
    try {
      await signUp.email({
        email: data.email,
        password: data.password,
        name: data.fullName,
        role: data.role,
        callbackURL: "/dashboard-redirect",
      } as Parameters<typeof signUp.email>[0], {
        onSuccess: () => {
          router.push("/dashboard-redirect");
        },
        onError: (ctx) => {
          setError(ctx.error.message || "Something went wrong. Please try again.");
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
        <h1 className="text-xl font-bold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Register to dispatch deliveries or manage logistics
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
            Full Name
          </label>
          <Input
            type="text"
            placeholder="John Doe"
            {...register("fullName")}
            disabled={isLoading}
          />
          {errors.fullName && (
            <p className="text-xs text-destructive font-medium">{errors.fullName.message}</p>
          )}
        </div>

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
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/95">
            Password
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
            Account Type (Role)
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setValue("role", e.target.value as RegisterInput["role"])}
            className="flex h-10 w-full rounded-xl border border-input bg-secondary/35 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-border/40 focus:border-primary transition-all duration-300"
            disabled={isLoading}
          >
            <option value="CUSTOMER">Customer (Ship & Track)</option>
            <option value="DELIVERY_AGENT">Delivery Agent (Fleet)</option>
            <option value="ADMIN">Administrator</option>
          </select>
          {errors.role && (
            <p className="text-xs text-destructive font-medium">{errors.role.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full py-5 rounded-xl font-bold" disabled={isLoading}>
          {isLoading ? <Loader size="sm" className="text-primary-foreground" /> : "Sign Up"}
        </Button>
      </form>

      <div className="text-center text-sm font-medium text-muted-foreground mt-4">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
