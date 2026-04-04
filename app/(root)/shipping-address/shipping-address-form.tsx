"use client";

import CheckoutSteps from "@/components/shared/checkout-steps";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { saveShippingAddress } from "@/lib/actions/checkout.actions";
import { shippingAddressDefaultValues } from "@/lib/constants";
import { shippingAddressSchema } from "@/lib/validator";
import { ShippingAddress } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ShippingAddressForm = ({
  address,
}: {
  address: ShippingAddress | null;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = (
    values,
  ) => {
    startTransition(async () => {
      const res = await saveShippingAddress(values);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      router.push("/payment-method");
    });
  };

  return (
    <>
      <CheckoutSteps current={1} />
      <div className="max-w-md mx-auto space-y-4 mt-8">
        <h1 className="h2-bold">Shipping Address</h1>
        <p className="text-sm text-muted-foreground">
          Please enter the address you want to ship to
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {["fullName", "streetAddress", "city", "postalCode", "country"].map(
              (fieldName) => (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={
                    fieldName as keyof z.infer<typeof shippingAddressSchema>
                  }
                  render={({ field }) => (
                    <FormItem
                      className={
                        fieldName === "city" || fieldName === "postalCode"
                          ? "w-full"
                          : ""
                      }
                    >
                      <FormLabel>
                        {fieldName
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder={`Enter ${fieldName}`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ),
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader className="animate-spin w-4 h-4 mr-2" />
                ) : (
                  <ArrowRight className="w-4 h-4 mr-2" />
                )}
                Continue to Payment
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default ShippingAddressForm;
