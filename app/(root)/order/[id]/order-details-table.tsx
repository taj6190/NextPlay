"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types";
import Image from "next/image";
import Link from "next/link";

const OrderDetailsTable = ({ order }: { order: Order }) => {
  return (
    <>
      <h1 className="py-4 text-2xl font-bold">Order {formatId(order.id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        {/* Left Column */}
        <div className="overflow-x-auto md:col-span-2 space-y-4">
          {/* Shipping Address */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <h2 className="font-semibold text-lg">Shipping Address</h2>
              <p>{order.shippingAddress.fullName}</p>
              <p>
                {order.shippingAddress.streetAddress},{" "}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                , {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Badge
                  variant="outline"
                  className="text-emerald-600 border-emerald-300"
                >
                  Delivered at {formatDateTime(order.deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not Delivered</Badge>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <h2 className="font-semibold text-lg">Payment Method</h2>
              <p>{order.paymentMethod}</p>
              {order.isPaid ? (
                <Badge
                  variant="outline"
                  className="text-emerald-600 border-emerald-300"
                >
                  Paid at {formatDateTime(order.paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not Paid</Badge>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <h2 className="font-semibold text-lg">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.orderItems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center gap-2"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded-md"
                          />
                          <span className="text-sm">{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-center">{item.qty}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(Number(item.price) * item.qty)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column — Order Summary */}
        <div>
          <Card>
            <CardContent className="p-4 space-y-3">
              <h2 className="font-semibold text-lg">Order Summary</h2>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items</span>
                <span>{formatCurrency(order.itemsPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatCurrency(order.shippingPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(order.taxPrice)}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-3">
                <span>Total</span>
                <span>{formatCurrency(order.totalPrice)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;
