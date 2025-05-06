import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { RSPrefs } from "@/preferences";
import { LayoutDirection } from "@/models/layout";

import StoreProvider from "@/lib/StoreProvider";
import PreferencesProvider from "@/preferences/PreferencesProvider";

export const runtime = "edge";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Thorium Web",
  description: "Play with the capabilities of the Readium Web Toolkit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={ inter.className }>
        <StoreProvider>
          <PreferencesProvider>
            { children  }
          </PreferencesProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
