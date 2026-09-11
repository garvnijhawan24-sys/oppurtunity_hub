import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

export default function EmptyState({
  title,
  description,
  actionText,
  actionHref,
  onActionClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white py-16 px-6 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>

      <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
        {description}
      </p>

      {(actionText && actionHref) && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors"
        >
          {actionText}
        </Link>
      )}

      {(actionText && !actionHref && onActionClick) && (
        <button
          onClick={onActionClick}
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
