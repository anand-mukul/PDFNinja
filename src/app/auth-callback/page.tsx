import React, { Suspense } from "react";
import AuthCallbackClient from "./AuthCallbackClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="w-full mt-24 flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin text-zinc-800" />
            <h3 className="font-semibold text-xl">
              Setting up your account...
            </h3>
            <p>You will be redirected automatically.</p>
          </div>
        </div>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  );
}
