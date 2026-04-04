import { getMyCart } from "@/lib/actions/cart.actions";
import { getCheckoutData } from "@/lib/actions/checkout.actions";
import { redirect } from "next/navigation";
import ShippingAddressForm from "./shipping-address-form";

const ShippingAddressPage = async () => {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect("/cart");

  const { address } = await getCheckoutData();

  return <ShippingAddressForm address={address} />;
};

export default ShippingAddressPage;
