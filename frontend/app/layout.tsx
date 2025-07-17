import "@/styles/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import clsx from "clsx";
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body
        className={clsx("font-sans antialiased", fontSans.variable)}
        style={{ width: "99.1vw", height: "100vh", alignContent: "center" }}
      >
        <main style={{ width: "100%", height: "100%" }}>
          <Providers themeProps={{ attribute: "class" }}>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
