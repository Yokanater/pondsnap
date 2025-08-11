'use client';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';

export default function Nav() {
  const { theme, toggle } = useTheme();
  return (
    <nav className="sticky top-0 z-40 backdrop-blur bg-pond-bg/80 dark:bg-pond-dark/70 border-b border-pond-green/20 dark:border-pond-teal/30 mb-6">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-serif text-xl text-pond-green dark:text-pond-teal hover:opacity-80">PondSnap</Link>
          <Link href="/add" className="text-sm text-pond-blue dark:text-pond-teal hover:underline">Add Pond</Link>
          <Link href="/map" className="text-sm text-pond-blue dark:text-pond-teal hover:underline">Map</Link>
        </div>
        <button onClick={toggle} className="text-xs px-3 py-1 rounded border border-pond-green/40 dark:border-pond-teal/40 text-pond-green dark:text-pond-teal hover:bg-pond-green/10 dark:hover:bg-pond-teal/30">
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
      </div>
    </nav>
  );
}
