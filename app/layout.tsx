// app/layout.tsx 
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "./components/SessionProvider";
import { getServerSession } from "next-auth/next";
import authOptions from "./lib/configs/auth/authOptions";
import Navbar from "@/components/Navbar";


const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  preload: true,
  adjustFontFallback: true
});

export const metadata: Metadata = {
  title: "งดเหล้าเข้าพรรษา",
  description: "มีสติ มีสุข ทุกโอกาส | ระบบงดเหล้าเข้าพรรษา",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="th">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}