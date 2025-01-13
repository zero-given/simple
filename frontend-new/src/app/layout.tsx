import React from 'react';
import type { Metadata } from 'next';
import { Inter, Quicksand, Bebas_Neue } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const quicksand = Quicksand({ 
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
});
const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Token Explorer',
  description: 'Real-time token monitoring and analysis platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${quicksand.variable} ${bebasNeue.variable} !bg-green-500`}>
        {children}
      </body>
    </html>
  );
} 