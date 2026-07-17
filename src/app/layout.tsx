import type { Metadata } from "next";
import { Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { BackgroundOrbs } from "@/components/brand/background-orbs";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Poppins is the whole app's typeface — body and headings, no second
// display font. Base size is bumped a notch in globals.css (html font-size)
// to read "un poco más grande" everywhere at once, rather than resizing
// every component individually.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Narela — La memoria de tu hogar",
  description:
    "La app que recuerda por ti todo lo que normalmente llevas en la cabeza.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${poppins.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Narela's brand look (fondo crema, cálido) is the light theme —
            forced regardless of OS preference, not left to system defaults. */}
        <ThemeProvider attribute="class" forcedTheme="light">
          <BackgroundOrbs />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
