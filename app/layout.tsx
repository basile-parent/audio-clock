import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Réveil + météo + musique",
  description: "Réveil + météo + musique",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={ process.env.NODE_ENV=== "development" ? "dev" : ""}>
      <head>
        <link rel="stylesheet" href="fonts.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
