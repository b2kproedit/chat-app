import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "LiveChat — Real-Time Chat",
  description: "A full-featured real-time chat application",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-100 text-slate-900 antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
