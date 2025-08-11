import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '../components/ThemeProvider';
import Nav from '../components/Nav';

export const metadata: Metadata = {
  title: 'PondSnap',
  description: 'Capture and map ponds beautifully.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-pond-bg dark:bg-pond-dark text-slate-800 dark:text-slate-100 transition-colors font-sans">
        <ThemeProvider>
          <Nav />
          <main className="max-w-5xl mx-auto px-4 pb-12 pt-4">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
