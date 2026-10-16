import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import ToastProvider from "@/components/ui/ToastProvider";
// Font variables defined as CSS variables with Google Fonts CDN in <head>
const fontVariables = "--font-cinzel: 'Cinzel', serif; --font-montserrat: 'Montserrat', sans-serif; --font-opensans: 'Open Sans', sans-serif; --font-playfair: 'Playfair Display', serif; --font-ebgaramond: 'EB Garamond', serif;";

export const metadata: Metadata = {
  title: "Creatibuz Studio — Document Engine",
  description: "Official Document & Agreement Engine for Creatibuz Studio. Design · Develop · Transform.",
  icons: {
    icon: "/fav.jpg",
    shortcut: "/fav.jpg",
    apple: "/fav.jpg",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@1,700;1,800;1,900&family=Cinzel:wght@700&family=EB+Garamond:ital,wght@0,400;0,700;1,400;1,700&family=Montserrat:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&family=Orbitron:wght@500;700;900&family=Oswald:wght@700&family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: `:root { ${fontVariables} }` }} />
      </head>
      <body className="min-h-full flex flex-col bg-[#F8FAFC]">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
