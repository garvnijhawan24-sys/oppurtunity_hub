'use client';

import React, { useSyncExternalStore, useRef } from 'react';

const subscribeTheme = (callback: () => void) => {
  window.addEventListener('theme-changed', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('theme-changed', callback);
    window.removeEventListener('storage', callback);
  };
};

const getThemeSnapshot = (): 'light' | 'dark' => {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

const getServerSnapshot = (): 'light' | 'dark' => 'light';

const subscribeMounted = () => () => {};

export default function ThemeToggle() {
  const isMounted = useSyncExternalStore(subscribeMounted, () => true, () => false);
  const currentTheme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerSnapshot);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const isDark = currentTheme === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';

    const applyTheme = () => {
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', nextTheme);
      window.dispatchEvent(new Event('theme-changed'));
    };

    if (
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      applyTheme();
      return;
    }

    const rect = buttonRef.current?.getBoundingClientRect();
    const x = e.clientX || (rect ? rect.left + rect.width / 2 : window.innerWidth / 2);
    const y = e.clientY || (rect ? rect.top + rect.height / 2 : 0);

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      applyTheme();
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 450,
          easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  if (!isMounted) {
    return <div className="h-9 w-9 rounded-full" />;
  }

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      aria-label="Toggle dark and light theme"
      title={currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-zinc-700 shadow-2xs transition-colors duration-150 hover:bg-zinc-200 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
    >
      <svg
        className="h-4 w-4 transition-all duration-300 transform dark:scale-0 dark:-rotate-90 text-zinc-700 dark:text-zinc-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="4" strokeWidth="2" />
        <path
          strokeWidth="2"
          strokeLinecap="round"
          d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m14.14-14.14l-1.41 1.41"
        />
      </svg>

      <svg
        className="absolute h-4 w-4 transition-all duration-300 transform scale-0 rotate-90 dark:scale-100 dark:rotate-0 text-zinc-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>
  );
}
