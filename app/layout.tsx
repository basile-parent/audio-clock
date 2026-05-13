import type { Metadata } from "next";
import "./globals.css";
import { DevContextProvider } from "./context/devContext";
import { AudiobookContextProvider } from "./context/audiobookContext";

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
          <AudiobookContextProvider>
            {children}
          </AudiobookContextProvider>
        </DevContextProvider>
      </body>
    </html>
  );
}
