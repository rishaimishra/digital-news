import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientSessionProvider from "@/components/providers/client-session-provider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digital News Platform",
  description: "Regional news portal with multi-city, multi-category, and multi-language support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientSessionProvider>
          <Header />
          {children}
          <Footer />
        </ClientSessionProvider>
      </body>
    </html>
  );
}

