import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Provider } from 'react-redux';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NewsHub - Tổng hợp tin tức',
  description: 'Nền tảng tổng hợp tin tức tự động từ nhiều nguồn uy tín',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        {children}
      </body>
    </html>
  );
}
