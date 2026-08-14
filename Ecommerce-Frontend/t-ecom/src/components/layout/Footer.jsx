import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="page-shell py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <div className="text-lg font-semibold tracking-tight">ShopGrid</div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Premium shopping with a faster interface, clearer navigation, and a cleaner product discovery flow.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div className="space-y-3">
              <div className="font-medium">Shop</div>
              <div className="flex flex-col gap-2 text-muted-foreground">
                <Link to="/">Home</Link>
                <Link to="/cart">Cart</Link>
                <Link to="/wishlist">Wishlist</Link>
              </div>
            </div>
            <div className="space-y-3">
              <div className="font-medium">Account</div>
              <div className="flex flex-col gap-2 text-muted-foreground">
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
                <Link to="/orders">Orders</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
