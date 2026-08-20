import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "The Delhi Darbar — Restaurant & Fast Food",
  description:
    "Order authentic Kashmiri Wazwan, Tandoori, Chinese & North Indian food from The Delhi Darbar, K.P. Road, Anantnag. Cash on Delivery or pay online. Customer's Satisfaction is Our Motive.",
  applicationName: "The Delhi Darbar",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Delhi Darbar",
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0a08",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="font-sans text-cream antialiased">
        {/* Phone-frame on desktop, full-bleed app on mobile */}
        <div className="min-h-dvh md:flex md:items-center md:justify-center md:bg-[radial-gradient(1200px_600px_at_50%_-10%,#1c140c_0%,#070503_60%)] md:p-6">
          <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-bg md:h-[min(100dvh-48px,920px)] md:max-w-[420px] md:rounded-[2.2rem] md:border md:border-white/10 md:shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
