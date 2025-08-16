import './globals.css';
import './mapbox.css';
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
          <div className="pointer-events-none fixed inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
            <div className="absolute -top-24 -left-24 w-[40rem] h-[40rem] bg-pond-green/10 dark:bg-pond-teal/15 blur-3xl rounded-full" />
            <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-pond-blue/10 dark:bg-pond-teal/10 blur-3xl rounded-full" />
          </div>
          <Nav />
          <main className="max-w-5xl mx-auto px-4 pb-12 pt-4">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
