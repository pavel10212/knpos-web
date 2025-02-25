import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "knPOS",
  description: "A modern point of sale application for restaurants.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/images/logo.png', type: 'image/png' }
    ],
    apple: [
      { url: '/images/logo.png' }
    ]
  },
  other: {
    'msapplication-TileImage': '/images/logo.png',
    'og:image': '/images/logo.png',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster richColors/>
      </body>
    </html>
  );
}
