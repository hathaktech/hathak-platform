import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "@/context/GlobalState";
import { AuthProvider } from "@/context/AuthContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { ModernNotificationProvider } from "@/context/ModernNotificationContext";
import { CartProvider } from "@/context/CartContext";
import { BuyForMeCartProvider } from "@/context/BuyForMeCartContext";
import { AddressProvider } from "@/context/AddressContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Header from "@/components/Header";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HatHak",
  description: "HatHak Platform - E-commerce & Logistics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';
  const isAdminRoute = pathname.startsWith('/admin');
  const isUserRoute = pathname.startsWith('/User');

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <GlobalProvider>
          <ErrorBoundary>
            <ModernNotificationProvider>
              <AuthProvider>
                <AdminAuthProvider>
                  <CartProvider>
                    <BuyForMeCartProvider>
                      <AddressProvider>
                      {isAdminRoute ? (
                        // Clean admin layout - no platform header/footer
                        <main className="flex-grow">{children}</main>
                      ) : isUserRoute ? (
                        // User control panel layout - header with no gap
                        <>
                          <Header />
                          <div className="flex-grow">{children}</div>
                        </>
                      ) : (
                        // Regular platform layout
                        <>
                          <Header />
                          <main className="flex-grow">{children}</main>
                          <CleanFooter />
                        </>
                      )}
                      </AddressProvider>
                    </BuyForMeCartProvider>
                  </CartProvider>
                </AdminAuthProvider>
              </AuthProvider>
            </ModernNotificationProvider>
          </ErrorBoundary>
        </GlobalProvider>
      </body>
    </html>
  );
}


// Brief footer with direct links
function CleanFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/logo.png" alt="HatHak" className="h-6 w-auto" />
              <span className="text-lg font-semibold text-gray-900">HatHak</span>
            </div>
            <p className="text-gray-600 text-sm">
              Your trusted e-commerce and logistics platform. 
              Streamlined shopping, secure payments, and reliable delivery.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-sm text-gray-600 hover:text-gray-900">Home</a></li>
              <li><a href="/HatHakStore" className="text-sm text-gray-600 hover:text-gray-900">Products</a></li>
              <li><a href="/cart" className="text-sm text-gray-600 hover:text-gray-900">Cart</a></li>
              <li><a href="/orders" className="text-sm text-gray-600 hover:text-gray-900">Orders</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="/help" className="text-sm text-gray-600 hover:text-gray-900">Help Center</a></li>
              <li><a href="/contact" className="text-sm text-gray-600 hover:text-gray-900">Contact Us</a></li>
              <li><a href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
              <li><a href="/terms" className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            © 2024 HatHak. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
