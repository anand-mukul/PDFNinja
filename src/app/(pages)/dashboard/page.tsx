import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import Dashboard from "@/components/Dashboard";
import { getUserSubscriptionPlan } from "@/lib/stripe";

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return redirect("/auth-callback?origin=dashboard");
  }

  const dbUser = await db.user.findFirst({
    where: { id: user.id },
  });

  if (!dbUser) redirect("/auth-callback?origin=dashboard");

  const subscriptionPlan = await getUserSubscriptionPlan();

  return (
    <div className="dark:bg-black/95 min-h-screen">
      <Dashboard subscriptionPlan={subscriptionPlan} />
    </div>
  );
};

export default Page;
