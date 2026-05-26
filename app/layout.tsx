import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Conversor Inteligente',
  description: 'Conversor de monedas y temperatura',
  manifest :'/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}