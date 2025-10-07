"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useBuyForMeCart } from "@/context/BuyForMeCartContext";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartItemCount, getTotalCartItemCount } = useCart();
  const { getCartItemCount: getBuyForMeCartItemCount } = useBuyForMeCart();
  const pathname = usePathname();

  // Get the appropriate cart count based on current page
  const getDisplayCartCount = () => {
    if (pathname.startsWith('/BuyForMe') || pathname.startsWith('/buyme')) {
      return getBuyForMeCartItemCount();
    } else if (pathname.startsWith('/HatHakStore') || pathname.startsWith('/cart')) {
      return getCartItemCount('store');
    } else {
      // Home page - show total count including buyforme cart
      return getTotalCartItemCount() + getBuyForMeCartItemCount();
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-orange-500 text-white p-4 flex justify-between items-center">
      <div className="font-bold text-xl">
        <Link href="/">HatHak</Link>
      </div>
      <div className="space-x-4 flex items-center">
        <Link href="/" className="hover:text-orange-200 transition-colors">
          Home
        </Link>
        <Link href="/HatHakStore" className="hover:text-orange-200 transition-colors">
          Products
        </Link>
        <Link href="/User/ControlPanel/BuyForMe/BuyForMeRequests" className="hover:text-orange-200 transition-colors">
          BuyMe Requests
        </Link>
        <Link href="/cart" className="hover:text-orange-200 transition-colors flex items-center gap-1">
          <ShoppingCart className="w-4 h-4" />
          Cart
          {getDisplayCartCount() > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[16px] text-center">
              {getDisplayCartCount()}
            </span>
          )}
        </Link>
        
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <Link href="/orders" className="hover:text-orange-200 transition-colors">
              My Orders
            </Link>
            {user?.role === 'admin' && (
              <Link href="/admin/buyme" className="hover:text-orange-200 transition-colors">
                Admin
              </Link>
            )}
            <div className="flex items-center space-x-2">
              <span className="text-sm">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="space-x-2">
            <Link
              href="/auth/login"
              className="bg-white text-orange-500 px-3 py-1 rounded hover:bg-orange-100 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="border border-white text-white px-3 py-1 rounded hover:bg-white hover:text-orange-500 transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
