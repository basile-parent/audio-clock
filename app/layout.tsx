import type { Metadata } from "next";
import "./globals.css";
import "./transitions.css";
import { DevContextProvider } from "./context/devContext";
import { ViewTransition } from "react";

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
    <html lang="fr">
      <head>
        <link rel="stylesheet" href="fonts.css" />
      </head>
      <body>
        <DevContextProvider>
          <ViewTransition>
            {children}
          </ViewTransition>
        </DevContextProvider>
      </body>
    </html>
  );
}
