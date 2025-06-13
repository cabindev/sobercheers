import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "./components/SessionProvider";
import { getServerSession } from "next-auth/next";
import authOptions from "./lib/configs/auth/authOptions";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
 title: "BUDDHIST LENT",
 description: "3 เดือนเปลี่ยนคุณเป็นคนใหม่",
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