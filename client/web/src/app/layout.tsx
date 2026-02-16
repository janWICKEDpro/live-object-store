import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SavedObjectsProvider } from "@/hooks/use-saved-objects";


const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Live Object Store",
  description: "Manage your 3D assets and visual objects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} antialiased font-sans`}
      >
        <SavedObjectsProvider>
          {children}
          <Toaster />
        </SavedObjectsProvider>
      </body>
    </html>
  );
}
