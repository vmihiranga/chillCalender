import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ChillRide Management — Calendar',
  description: 'A sleek Google Calendar-style event scheduling app for ChillRide.',
  keywords: ['calendar', 'events', 'scheduling', 'chillride'],
  openGraph: {
    title: 'ChillRide Management',
    description: 'Schedule and manage your ChillRide events effortlessly.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
