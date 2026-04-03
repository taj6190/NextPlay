// "use client";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
// import { formatCurrency } from "@/lib/utils";
// import { Cart, CartItem } from "@/types";
// import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useTransition } from "react";
// import { toast } from "sonner";

// const CartTable = ({ cart }: { cart?: Cart }) => {
//   const router = useRouter();
//   const [isPending, startTransition] = useTransition();

//   const handleRemove = (productId: string) => {
//     startTransition(async () => {
//       const res = await removeItemFromCart(productId);
//       if (!res.success) toast.error(res.message);
//       else toast.success(res.message);
//     });
//   };

//   const handleAdd = (item: CartItem) => {
//     startTransition(async () => {
//       const res = await addItemToCart(item);
//       if (!res.success) toast.error(res.message);
//       else toast.success(res.message);
//     });
//   };

//   return (
//     <>
//       <h1 className="py-4 h2-bold">Shopping Cart</h1>
//       {!cart || cart.items.length === 0 ? (
//         <div>
//           Cart is empty. <Link href="/">Go shopping</Link>
//         </div>
//       ) : (
//         <div className="grid md:grid-cols-4 md:gap-5">
//           {/* Items Table */}
//           <div className="overflow-x-auto md:col-span-3">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Item</TableHead>
//                   <TableHead className="text-center">Quantity</TableHead>
//                   <TableHead className="text-right">Price</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {cart.items.map((item) => (
//                   <TableRow key={item.slug}>
//                     <TableCell>
//                       <Link
//                         href={`/product/${item.slug}`}
//                         className="flex items-center gap-2"
//                       >
//                         <Image
//                           src={item.image}
//                           alt={item.name}
//                           width={50}
//                           height={50}
//                         />
//                         <span>{item.name}</span>
//                       </Link>
//                     </TableCell>

//                     <TableCell>
//                       <div className="flex items-center justify-center gap-2">
//                         <Button
//                           disabled={isPending}
//                           variant="outline"
//                           type="button"
//                           onClick={() => handleRemove(item.productId)}
//                         >
//                           {isPending ? (
//                             <Loader className="w-4 h-4 animate-spin" />
//                           ) : (
//                             <Minus className="w-4 h-4" />
//                           )}
//                         </Button>
//                         <span>{item.qty}</span>
//                         <Button
//                           disabled={isPending}
//                           variant="outline"
//                           type="button"
//                           onClick={() => handleAdd(item)}
//                         >
//                           {isPending ? (
//                             <Loader className="w-4 h-4 animate-spin" />
//                           ) : (
//                             <Plus className="w-4 h-4" />
//                           )}
//                         </Button>
//                       </div>
//                     </TableCell>

//                     <TableCell className="text-right">
//                       ${(Number(item.price) * item.qty).toFixed(2)}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//           <Card>
//             <CardContent className="p-4   gap-4">
//               <div className="pb-3 text-xl">
//                 Subtotal ({cart.items.reduce((a, c) => a + c.qty, 0)}):
//                 {formatCurrency(cart.itemsPrice)}
//               </div>
//               <Button
//                 onClick={() =>
//                   startTransition(() => router.push("/shipping-address"))
//                 }
//                 className="w-full"
//                 disabled={isPending}
//               >
//                 {isPending ? (
//                   <Loader className="animate-spin w-4 h-4" />
//                 ) : (
//                   <ArrowRight className="w-4 h-4" />
//                 )}
//                 Proceed to Checkout
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </>
//   );
// };

// export default CartTable;

"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { formatCurrency } from "@/lib/utils";
import { Cart, CartItem } from "@/types";
import {
  ArrowRight,
  Loader,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRemove = (productId: string) => {
    startTransition(async () => {
      const res = await removeItemFromCart(productId);
      if (!res.success) toast.error(res.message);
      else toast.success(res.message);
    });
  };

  const handleAdd = (item: CartItem) => {
    startTransition(async () => {
      const res = await addItemToCart(item);
      if (!res.success) toast.error(res.message);
      else toast.success(res.message);
    });
  };

  const totalItems = cart?.items.reduce((a, c) => a + c.qty, 0) ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-muted/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <ShoppingBag className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Your Cart</h1>
            <p className="text-xs text-muted-foreground">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {!cart || cart.items.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
            <div className="p-6 rounded-full bg-muted/40">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/50" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">Your cart is empty</h2>
              <p className="text-muted-foreground text-sm">
                Looks like you haven&apos;t added anything yet.
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" className="rounded-full px-6">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3">
              <div className="rounded-2xl border border-border/50 overflow-hidden bg-card shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="text-xs uppercase tracking-widest font-semibold text-muted-foreground py-4 pl-5">
                        Product
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-widest font-semibold text-muted-foreground text-center">
                        Qty
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-widest font-semibold text-muted-foreground text-right pr-5">
                        Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.items.map((item, index) => (
                      <TableRow
                        key={item.slug}
                        className="border-border/40 hover:bg-muted/20 transition-colors"
                        style={{ animationDelay: `${index * 60}ms` }}
                      >
                        {/* Product */}
                        <TableCell className="py-4 pl-5">
                          <Link
                            href={`/product/${item.slug}`}
                            className="flex items-center gap-3 group"
                          >
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-border/40 bg-muted/30 flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                {item.name}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatCurrency(Number(item.price))} each
                              </p>
                            </div>
                          </Link>
                        </TableCell>

                        {/* Quantity */}
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              disabled={isPending}
                              variant="outline"
                              size="icon"
                              type="button"
                              className="w-7 h-7 rounded-lg border-border/50"
                              onClick={() => handleRemove(item.productId)}
                            >
                              {isPending ? (
                                <Loader className="w-3 h-3 animate-spin" />
                              ) : (
                                <Minus className="w-3 h-3" />
                              )}
                            </Button>
                            <span className="w-6 text-center text-sm font-semibold">
                              {item.qty}
                            </span>
                            <Button
                              disabled={isPending}
                              variant="outline"
                              size="icon"
                              type="button"
                              className="w-7 h-7 rounded-lg border-border/50"
                              onClick={() => handleAdd(item)}
                            >
                              {isPending ? (
                                <Loader className="w-3 h-3 animate-spin" />
                              ) : (
                                <Plus className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </TableCell>

                        {/* Price */}
                        <TableCell className="text-right pr-5 font-semibold text-sm">
                          {formatCurrency(Number(item.price) * item.qty)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Free shipping notice */}
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 text-sm">
                <Truck className="w-4 h-4 flex-shrink-0" />
                {Number(cart.itemsPrice) > 100 ? (
                  <span>
                    🎉 You qualify for <strong>free shipping!</strong>
                  </span>
                ) : (
                  <span>
                    Add{" "}
                    <strong>
                      {formatCurrency(100 - Number(cart.itemsPrice))}
                    </strong>{" "}
                    more for free shipping
                  </span>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-border/40 bg-muted/20">
                  <h2 className="font-semibold text-sm uppercase tracking-widest text-muted-foreground">
                    Order Summary
                  </h2>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subtotal ({totalItems} items)
                    </span>
                    <span className="font-medium">
                      {formatCurrency(cart.itemsPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {Number(cart.shippingPrice) === 0 ? (
                        <span className="text-emerald-600 font-semibold">
                          Free
                        </span>
                      ) : (
                        formatCurrency(cart.shippingPrice)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">
                      {formatCurrency(cart.taxPrice)}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-border/50">
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold">Total</span>
                      <span className="text-2xl font-bold">
                        {formatCurrency(cart.totalPrice)}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-2 rounded-xl h-11 font-semibold"
                    disabled={isPending}
                    onClick={() =>
                      startTransition(() => router.push("/shipping-address"))
                    }
                  >
                    {isPending ? (
                      <Loader className="animate-spin w-4 h-4 mr-2" />
                    ) : (
                      <ArrowRight className="w-4 h-4 mr-2" />
                    )}
                    Proceed to Checkout
                  </Button>

                  <Link href="/">
                    <Button
                      variant="ghost"
                      className="w-full text-muted-foreground text-sm"
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartTable;
