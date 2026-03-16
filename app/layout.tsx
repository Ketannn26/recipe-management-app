// app/layout.tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CookingProvider } from "@/context/cookingContext";
import { ReduxProvider } from "@/components/ReduxProvider";
import { Navbar } from "@/components/Navbar";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rasoi Management App",
  description: "Browse, save and cook your favourite recipes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        <ReduxProvider>
          <CookingProvider>
            <Navbar />
            {children}
          </CookingProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
