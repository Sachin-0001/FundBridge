import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ReactQueryProvider } from "@/lib/react-query";

import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FundBridge AI | Smart Loan Marketplace",
  description: "Connect your business with the best lenders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background antialiased flex flex-col`}>
        <ReactQueryProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
