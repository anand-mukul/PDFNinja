import BillingForm from "@/components/BillingForm";
import { getUserSubscriptionPlan } from "@/lib/stripe";

const Page = async () => {
  const subscriptionPlan = await getUserSubscriptionPlan();

  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <BillingForm subscriptionPlan={subscriptionPlan} />
    </div>
  );
};

export default Page;
