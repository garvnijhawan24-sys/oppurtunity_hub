import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 transition-colors">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-zinc-900">
                OH
              </span>
              <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white">
                OpportunityHub
              </span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-sm">
              A curated platform for university students to track hackathons,
              internships, workshops, and competitions without noise.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Platform
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Explore Opportunities
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Saved Dashboard
                </Link>
              </li>
              <li>
                <Link href="/add" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Submit Opportunity
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Categories
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/explore?category=Hackathon" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Hackathons
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Internship" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Internships
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Workshop" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Workshops
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Competition" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Competitions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-100 pt-6 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500">
          <p>© {new Date().getFullYear()} OpportunityHub. Crafted for collegiate engineers.</p>
        </div>
      </div>
    </footer>
  );
}
