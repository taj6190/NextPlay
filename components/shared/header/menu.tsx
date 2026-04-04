import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { EllipsisVertical, ShoppingCart } from "lucide-react";
import Link from "next/link";
import ModeToggle from "./mode-toggle";
import UserButton from "./user-button";

const Menu = () => {
  return (
    <div className="flex justify-end gap-2 items-center">
      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-1">
        <ModeToggle />
        <Button asChild variant="ghost" size="sm">
          <Link href="/cart" className="flex items-center gap-1.5">
            <ShoppingCart className="w-4 h-4" />
            Cart
          </Link>
        </Button>
        <UserButton />
      </nav>

      {/* Mobile Nav */}
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVertical className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col gap-4 pt-8">
            <SheetTitle className="text-left">Menu</SheetTitle>
            <div className="flex flex-col gap-3">
              <ModeToggle />
              <Button asChild variant="ghost" className="justify-start">
                <Link href="/cart" className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Cart
                </Link>
              </Button>
              <UserButton />
            </div>
            <SheetDescription />
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
