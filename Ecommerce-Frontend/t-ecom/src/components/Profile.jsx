import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AppContext from "@/Context/Context";

const Profile = () => {
  const { currentUser, cart, wishlist } = useContext(AppContext);

  const initials = currentUser?.username ? currentUser.username.slice(0, 2).toUpperCase() : "U";

  return (
    <div className="page-shell section-shell">
      <div>
        <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Profile</div>
        <h1 className="section-title">Account overview</h1>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-lg text-primary">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-lg font-semibold">{currentUser?.username}</div>
              <div className="text-sm text-muted-foreground">
                {currentUser?.role?.replace("ROLE_", "") || "User"}
              </div>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/orders">View orders</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Cart items</div>
              <div className="mt-3 text-3xl font-semibold">{cart.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Wishlist items</div>
              <div className="mt-3 text-3xl font-semibold">{wishlist.length}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
