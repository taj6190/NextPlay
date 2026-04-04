import { auth } from "@/auth";
import { getOrderById } from "@/lib/actions/order.actions";
import { ShippingAddress } from "@/types";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import OrderDetailsTable from "./order-details-table";

export const metadata = { title: "Order Details" };

const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;

  const order = await getOrderById(id);
  if (!order) notFound();

  // Allow access if logged-in user owns the order
  // OR if guest has this orderId in their cookie
  const session = await auth();
  const cookieStore = await cookies();
  const lastOrderId = cookieStore.get("lastOrderId")?.value;

  const isOwner = session?.user?.id && order.userId === session.user.id;
  const isGuestOrder = !order.userId && lastOrderId === id;

  if (!isOwner && !isGuestOrder) {
    redirect("/");
  }

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
        itemsPrice: order.itemsPrice.toString(),
        shippingPrice: order.shippingPrice.toString(),
        taxPrice: order.taxPrice.toString(),
        totalPrice: order.totalPrice.toString(),
        user: order.user ?? null,
        orderItems: order.orderItems.map((item) => ({
          ...item,
          price: item.price.toString(),
        })),
      }}
    />
  );
};

export default OrderDetailsPage;
