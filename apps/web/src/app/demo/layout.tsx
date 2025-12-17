// import './globals.css'
import React from 'react';

export const metadata = {
  title: 'Demo',
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
