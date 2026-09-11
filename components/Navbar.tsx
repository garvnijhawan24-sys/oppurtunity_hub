'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import CardNav, { CardNavItem } from './CardNav';

export default function Navbar() {
  const pathname = usePathname();
  const [savedCount, setSavedCount] = useState<number>(0);

  useEffect(() => {
    async function fetchSavedCount() {
      try {
        const res = await fetch('/api/saved');
        const data = await res.json();
        if (data.success && typeof data.count === 'number') {
          setSavedCount(data.count);
        }
      } catch {
        const local = localStorage.getItem('saved_opportunities');
        if (local) {
          try {
            const arr = JSON.parse(local);
            setSavedCount(arr.length);
          } catch {
          }
        }
      }
    }

    fetchSavedCount();

    const handleBookmarkChange = () => fetchSavedCount();
    window.addEventListener('bookmark-updated', handleBookmarkChange);
    return () => window.removeEventListener('bookmark-updated', handleBookmarkChange);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Explore', href: '/explore' },
    {
      name: 'Dashboard',
      href: '/dashboard',
      badge: savedCount > 0 ? savedCount : null,
    },
  ];

  const mobileNavItems: CardNavItem[] = [
    {
      label: 'Explore',
      bgColor: '#18181b',
      textColor: '#fafafa',
      links: [
        { label: 'All Opportunities', href: '/explore', ariaLabel: 'Explore all opportunities' },
        { label: 'Hackathons', href: '/explore?category=Hackathon', ariaLabel: 'Browse hackathons' },
        { label: 'Internships', href: '/explore?category=Internship', ariaLabel: 'Browse internships' },
        { label: 'Workshops', href: '/explore?category=Workshop', ariaLabel: 'Browse workshops' },
      ],
    },
    {
      label: 'Dashboard',
      bgColor: '#27272a',
      textColor: '#fafafa',
      links: [
        {
          label: savedCount > 0 ? `Saved Tracker (${savedCount})` : 'Saved Tracker',
          href: '/dashboard',
          ariaLabel: 'View saved opportunities tracker',
        },
        { label: 'Submit Opportunity', href: '/add', ariaLabel: 'Post a new opportunity' },
      ],
    },
    {
      label: 'Programs',
      bgColor: '#3f3f46',
      textColor: '#fafafa',
      links: [
        { label: 'Student Competitions', href: '/explore?category=Competition', ariaLabel: 'Browse competitions' },
        { label: 'Public Dev Community', href: '/explore', ariaLabel: 'Dev community events' },
      ],
    },
  ];

  return (
    <>
      <header className="hidden md:block sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95 transition-colors">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white font-semibold text-sm dark:bg-white dark:text-zinc-900">
              OH
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">
                OpportunityHub
              </span>
              <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-mono font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                v1.0
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                    isActive
                      ? 'text-zinc-900 font-semibold bg-zinc-100 dark:text-white dark:bg-zinc-800/60'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.name}
                    {link.badge !== null && (
                      <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-900 px-1 text-[10px] font-bold text-white dark:bg-white dark:text-zinc-900">
                        {link.badge}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />

            <Link
              href="/add"
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 active:scale-98 transition-all dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Post Opportunity</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="block md:hidden sticky top-2.5 z-50 px-3 w-full">
        <CardNav
          items={mobileNavItems}
          ctaText="Post"
          ctaHref="/add"
        />
      </div>
    </>
  );
}
