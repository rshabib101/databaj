import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DataBaj IT Agency | Web Development, Marketing & E-commerce Tracking",
  description: "DataBaj is a premier IT Agency specializing in Full-Stack Web Development, High-ROAS Digital Marketing, Server-Side CAPI Tracking, and Facebook Ads Performance Audit.",
};

import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col transition-colors duration-200">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
