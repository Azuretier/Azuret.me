import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, VT323 } from "next/font/google";
import "./globals.css"; //apply style
import React from 'react'

import Provider from './provider';

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

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans", // Maps to var(--font-sans) in CSS
});

const vt323 = VT323({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel", // Maps to var(--font-pixel) in CSS
});

export const metadata: Metadata = {
  title: 'azuret.me',
  description: "A website created by Azuret.",
  openGraph: {
    title: "azuret.me",
    description: "A website created by Azuret.",
    locale: 'ja-JP',
    type: 'website',
  },
};


const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='ja'>
      <meta name="theme-color" content="#ffbd43"></meta>
      <link rel="icon" href="/favicon.ico" />
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${vt323.variable} antialiased`}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}

export default RootLayout