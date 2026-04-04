"use client";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/order.actions";
import { Check, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

const PlaceOrderForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const res = await createOrder();
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      if (res.orderId) {
        router.push(`/order/${res.orderId}`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Button disabled={isPending} className="w-full" type="submit">
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Check className="w-4 h-4" />
        )}{" "}
        Place Order
      </Button>
    </form>
  );
};

export default PlaceOrderForm;
