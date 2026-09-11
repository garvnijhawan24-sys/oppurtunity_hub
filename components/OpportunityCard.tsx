'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IOpportunity } from '@/lib/types';
import CategoryBadge from './CategoryBadge';

interface OpportunityCardProps {
  opportunity: IOpportunity;
  isInitiallySaved?: boolean;
  onBookmarkToggle?: (id: string, saved: boolean) => void;
}

export default function OpportunityCard({
  opportunity,
  isInitiallySaved = false,
  onBookmarkToggle,
}: OpportunityCardProps) {
  const [isSaved, setIsSaved] = useState<boolean>(isInitiallySaved);
  const [loadingSave, setLoadingSave] = useState<boolean>(false);

  const deadlineDate = new Date(opportunity.deadline);
  const now = new Date();
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isExpired = diffDays < 0;
  const isUrgent = diffDays >= 0 && diffDays <= 3;

  const formattedDeadline = !isNaN(deadlineDate.getTime())
    ? deadlineDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Ongoing';

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loadingSave) return;

    setLoadingSave(true);
    const nextSavedState = !isSaved;

    setIsSaved(nextSavedState);

    try {
      if (nextSavedState) {
        await fetch('/api/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ opportunityId: opportunity._id }),
        });
      } else {
        await fetch('/api/saved', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ opportunityId: opportunity._id }),
        });
      }

      if (onBookmarkToggle) {
        onBookmarkToggle(opportunity._id, nextSavedState);
      }
      window.dispatchEvent(new Event('bookmark-updated'));
    } catch (err) {
      console.error('Bookmark error:', err);
      setIsSaved(!nextSavedState);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-xs transition-all duration-150 hover:border-zinc-400 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <div>
        <div className="flex items-center justify-between gap-2">
          <CategoryBadge category={opportunity.category} />

          <button
            onClick={handleSaveToggle}
            disabled={loadingSave}
            title={isSaved ? 'Remove from saved' : 'Save opportunity'}
            className={`min-h-[44px] min-w-[44px] -mr-2 -mt-2 flex items-center justify-center rounded-lg touch-manipulation active:scale-90 transition-all ${
              isSaved
                ? 'text-amber-600 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400'
                : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
            }`}
            aria-label={isSaved ? 'Unsave opportunity' : 'Save opportunity'}
          >
            <svg
              className="h-4 w-4"
              fill={isSaved ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
        </div>

        <h3 className="mt-3 text-base font-semibold leading-snug tracking-tight text-zinc-900 group-hover:text-zinc-700 dark:text-white dark:group-hover:text-zinc-200">
          <Link href={`/opportunities/${opportunity._id}`} className="focus:outline-hidden">
            {opportunity.title}
          </Link>
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-zinc-600 line-clamp-2 dark:text-zinc-300">
          {opportunity.description}
        </p>
      </div>

      <div className="mt-5 border-t border-zinc-100 pt-3.5 dark:border-zinc-800">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            {isUrgent ? (
              <span className="flex items-center gap-1 font-medium text-red-600 dark:text-red-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                {diffDays === 0
                  ? 'Due today!'
                  : `${diffDays} day${diffDays > 1 ? 's' : ''} left`}
              </span>
            ) : isExpired ? (
              <span className="text-zinc-400 line-through dark:text-zinc-500">
                Ended {formattedDeadline}
              </span>
            ) : (
              <span className="text-zinc-600 dark:text-zinc-300">
                Due {formattedDeadline}
              </span>
            )}
          </div>

          <Link
            href={`/opportunities/${opportunity._id}`}
            className="min-h-[38px] px-2.5 py-1.5 rounded-lg font-medium text-zinc-900 hover:underline dark:text-white inline-flex items-center gap-1 touch-manipulation active:scale-95 transition-all"
          >
            <span>Details</span>
            <svg
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
