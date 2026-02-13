import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Vault OS | Smart Bookmarks',
  description: 'Professional-grade link management',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased bg-[#fafafa]">
        {/* Removed max-w-2xl and padding. 
            The children (HomePage) will now handle its own layout and sizing.
        */}
        {children}
      </body>
    </html>
  );
}