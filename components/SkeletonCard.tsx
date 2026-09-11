import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 animate-pulse">
      <div>
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 rounded-md bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-6 w-6 rounded-md bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="mt-4 h-5 w-3/4 rounded-md bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-2.5 h-3.5 w-full rounded-md bg-zinc-100 dark:bg-zinc-800/60" />
        <div className="mt-1.5 h-3.5 w-4/5 rounded-md bg-zinc-100 dark:bg-zinc-800/60" />
      </div>
      <div className="mt-6 border-t border-zinc-100 pt-3.5 dark:border-zinc-800 flex items-center justify-between">
        <div className="h-3.5 w-24 rounded-md bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3.5 w-12 rounded-md bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}
