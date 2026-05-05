import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spy Web Cams — Curated Affiliate Deals & Best Finds",
  description: "Your trusted destination for curated Temu affiliate deals. We analyze trends, price history and reviews to bring you the best value items daily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Cormorant+Garant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#faf6f0] text-[#1a1a1a] font-body antialiased">
        {children}
      </body>
    </html>
  );
}
