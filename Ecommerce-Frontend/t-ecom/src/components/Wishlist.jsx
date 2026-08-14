import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { HeartOff, Trash2 } from "lucide-react";
import AppContext from "@/Context/Context";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useContext(AppContext);

  return (
    <div className="page-shell section-shell">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Wishlist</div>
          <h1 className="section-title">Saved items</h1>
        </div>
        <Button asChild variant="outline">
          <Link to="/">Continue shopping</Link>
        </Button>
      </div>

      {wishlist.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <HeartOff className="h-12 w-12 text-muted-foreground" />
            <div>
              <h2 className="text-xl font-semibold">Nothing saved yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Use the wishlist button on a product card to save it here.
              </p>
            </div>
            <Button asChild>
              <Link to="/">Browse products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {wishlist.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} compact />
              <button
                type="button"
                onClick={() => removeFromWishlist(product.id)}
                className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/90 shadow-sm"
                aria-label="Remove from wishlist"
              >
                <Trash2 className="h-4 w-4 text-rose-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
