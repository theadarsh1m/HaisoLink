import { Loader } from "@/components/ui/loader";

export default function DashboardRedirectPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Loader variant="fullscreen" text="Redirecting to your dashboard..." />
    </div>
  );
}
