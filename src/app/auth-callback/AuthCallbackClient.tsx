"use client";

import { useEffect, useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { Loader2 } from "lucide-react";

const AuthCallbackClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const originRaw = searchParams.get("origin") || "";
  const origin = useMemo(() => {
    if (!originRaw) return "/dashboard";
    return originRaw.startsWith("/") ? originRaw : `/${originRaw}`;
  }, [originRaw]);

  const { data, error, isSuccess, isError } = trpc.authCallback.useQuery(
    undefined,
    { retry: true, retryDelay: 500 }
  );

  useEffect(() => {
    if (isSuccess && data?.success) {
      startTransition(() => router.push(origin));
    }
  }, [isSuccess, data?.success, origin, router]);

  useEffect(() => {
    if (isError && error?.data?.code === "UNAUTHORIZED") {
      startTransition(() => router.push("/sign-in?error=unauthorized"));
    }
  }, [isError, error, router]);

  if (isPending) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
          <h3 className="font-semibold text-xl">Setting up your account...</h3>
          <p>You will be redirected automatically.</p>
        </div>
      </div>
    );
  }
  return null;
};

export default AuthCallbackClient;
