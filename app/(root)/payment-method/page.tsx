import { getMyCart } from "@/lib/actions/cart.actions";
import { getCheckoutData } from "@/lib/actions/checkout.actions";
import { redirect } from "next/navigation";
import PaymentMethodForm from "./payment-method-form";

const PaymentMethodPage = async () => {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect("/cart");

  const { address, paymentMethod } = await getCheckoutData();
  if (!address) redirect("/shipping-address");

  return <PaymentMethodForm preferredPaymentMethod={paymentMethod} />;
};

export default PaymentMethodPage;
