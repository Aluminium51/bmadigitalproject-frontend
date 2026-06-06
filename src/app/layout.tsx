import "./globals.css";
import type { Metadata } from "next";
// 1. Import ฟอนต์ Noto Sans Thai
import { Noto_Sans_Thai } from "next/font/google";


// 2. ตั้งค่าฟอนต์
const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"], // เลือกน้ำหนักที่ใช้
  variable: "--font-noto-sans-thai", // ตั้งชื่อ CSS Variable
  display: "swap",
});

export const metadata: Metadata = {
  title: "ระบบจัดการโครงการ กทม.",
  description: "...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 3. แนบ Variable เข้าไปที่ html
    <html lang="th" className={`${notoSansThai.variable}`}>
      {/* 4. เรียกใช้คลาส font-sans ที่เราจะไปผูกไว้ใน Tailwind */}
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}