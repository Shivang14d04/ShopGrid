import React, { useContext, useMemo, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, Search, Heart, ShoppingCart, User, LogOut, ChevronDown } from "lucide-react";
import axios from "@/axios";
import AppContext from "@/Context/Context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const categories = [
  "Laptop",
  "Headphone",
  "Mobile",
  "Electronics",
  "Toys",
  "Fashion",
];

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/product", label: "Products" },
  { to: "/cart", label: "Cart" },
];

const Header = ({ onSelectCategory }) => {
  const { isAuthenticated, currentUser, logout, cart, wishlist } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const initials = useMemo(() => {
    if (!currentUser?.username) return "U";
    return currentUser.username.slice(0, 2).toUpperCase();
  }, [currentUser]);

  const handleSearch = async (event) => {
    event.preventDefault();
    const keyword = search.trim();
    if (!keyword) return;

    try {
      const response = await axios.get(`/products/search?keyword=${encodeURIComponent(keyword)}`);
      navigate("/search-results", { state: { searchData: response.data, keyword } });
      setOpen(false);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const handleCategorySelect = (category) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    }
    navigate("/");
    setOpen(false);
  };

  const activeClass = ({ isActive }) =>
    cn(
      "rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
    );

  return (
    <header className="site-header">
      <div className="page-shell site-header-inner">
        <div className="flex items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] p-0">
              <div className="flex h-full flex-col">
                <SheetHeader className="border-b border-border p-6 text-left">
                  <SheetTitle>ShopGrid</SheetTitle>
                </SheetHeader>
                <div className="flex-1 space-y-6 p-6">
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search products"
                    />
                    <Button type="submit" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>

                  <nav className="space-y-1">
                    {navLinks.map((link) => (
                      <NavLink key={link.to} to={link.to} className={activeClass} onClick={() => setOpen(false)}>
                        {link.label}
                      </NavLink>
                    ))}
                  </nav>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Categories</div>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant="outline"
                          className="justify-start"
                          onClick={() => handleCategorySelect(category)}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="site-brand" aria-label="ShopGrid home">
            <motion.div
              animate={{ rotate: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="site-brand-mark"
            >
              SG
            </motion.div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold tracking-tight">ShopGrid</div>
              <div className="text-xs text-muted-foreground">Premium commerce</div>
            </div>
          </Link>
        </div>

        <NavigationMenu className="site-nav">
          <NavigationMenuList>
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.to}>
                <NavigationMenuLink asChild>
                  <NavLink to={link.to} className={activeClass}>
                    {link.label}
                  </NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-muted-foreground">Categories</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[560px] grid-cols-2 gap-2 p-3">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className="rounded-lg border border-border px-3 py-3 text-left text-sm transition-colors hover:bg-accent"
                      onClick={() => handleCategorySelect(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="site-actions">
          <form onSubmit={handleSearch} className="site-search">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, brands, categories"
                className="h-11 rounded-full pl-10 pr-4"
              />
            </div>
          </form>

          <Button variant="ghost" size="icon" asChild className="site-action-button relative">
            <Link to="/wishlist" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full px-1 text-[10px]">
                  {wishlistCount}
                </Badge>
              )}
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild className="site-action-button relative">
            <Link to="/cart" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full px-1 text-[10px]">
                  {cartCount}
                </Badge>
              )}
            </Link>
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="site-pill flex items-center gap-2 px-2 py-1.5 pr-3 transition-colors hover:bg-accent">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium sm:block">
                    {currentUser?.username || "Profile"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{currentUser?.username}</div>
                    <div className="text-xs text-muted-foreground">
                      {currentUser?.role?.replace("ROLE_", "") || "Guest"}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/wishlist">Wishlist</Link>
                </DropdownMenuItem>
                {currentUser?.role === "ROLE_ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">Admin dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="text-rose-500 focus:text-rose-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Create account</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
