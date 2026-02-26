import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { BuyerAuthProvider } from "@/context/BuyerAuthContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Boriwala Trading Co. | B2B Trading & Industrial Packaging",
    template: "%s | Boriwala Trading Co.",
  },
  description:
    "Leading B2B trading company dealing in PP Bags, Jute Bags, Plastic Products, Industrial Packaging Materials, Scrap Materials & more. Get the best prices for bulk orders.",
  keywords: [
    "B2B trading",
    "PP bags",
    "jute bags",
    "plastic products",
    "industrial packaging",
    "scrap materials",
    "bulk packaging",
    "HDPE bags",
    "cement bags",
    "packaging materials",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Boriwala Trading Co.",
    title: "Boriwala Trading Co. | B2B Trading & Industrial Packaging",
    description:
      "Leading B2B trading company dealing in PP Bags, Jute Bags, Plastic Products & Industrial Packaging Materials.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <BuyerAuthProvider>
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          {children}
        </BuyerAuthProvider>
      </body>
    </html>
  );
}
