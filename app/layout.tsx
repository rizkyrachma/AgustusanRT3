import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Kas Agustusan RT3",
  description: "Aplikasi pencatatan kas panitia Kemerdekaan Indonesia ke-81 RT3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${montserrat.variable} ${playfair.variable} font-sans antialiased bg-gray-50 text-gray-900 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
