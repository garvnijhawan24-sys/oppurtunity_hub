'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IOpportunity } from '@/lib/types';
import CategoryBadge from '@/components/CategoryBadge';
import SkeletonCard from '@/components/SkeletonCard';
import EmptyState from '@/components/EmptyState';

interface PopulatedSavedItem {
  _id: string;
  savedAt: string;
  opportunityId: IOpportunity;
}

export default function DashboardPage() {
  const [savedItems, setSavedItems] = useState<PopulatedSavedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let ignore = false;

    async function loadSavedOpportunities() {
      try {
        const res = await fetch('/api/saved');
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.data)) {
          const valid = data.data.filter(
            (item: PopulatedSavedItem) =>
              item.opportunityId && typeof item.opportunityId === 'object'
          );
          setSavedItems(valid);
        }
      } catch (err) {
        console.error('Error fetching dashboard saved items:', err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadSavedOpportunities();

    return () => {
      ignore = true;
    };
  }, []);

  const handleRemoveSaved = async (opportunityId: string) => {
    const previousItems = [...savedItems];

    setSavedItems((prev) =>
      prev.filter((item) => item.opportunityId._id !== opportunityId)
    );

    try {
      const res = await fetch('/api/saved', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId }),
      });
      if (!res.ok) {
        throw new Error('Failed to remove bookmark on server');
      }
      window.dispatchEvent(new Event('bookmark-updated'));
    } catch (err) {
      console.error('Error removing bookmark:', err);
      setSavedItems(previousItems);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Saved Opportunities
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Your personalized tracker for upcoming deadlines and programs
            </p>
          </div>
          <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
            {savedItems.length} Bookmark{savedItems.length === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : savedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedItems.map((item) => {
            const opp = item.opportunityId;
            const deadlineDate = new Date(opp.deadline);
            const diffDays = Math.ceil(
              (deadlineDate.getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            );
            const isUrgent = diffDays >= 0 && diffDays <= 3;

            return (
              <div
                key={item._id}
                className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <CategoryBadge category={opp.category} />
                    <button
                      onClick={() => handleRemoveSaved(opp._id)}
                      className="min-h-[40px] px-2.5 py-1.5 -mr-2 -mt-1.5 inline-flex items-center text-xs font-medium text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 touch-manipulation active:scale-95 transition-all"
                      title="Remove from saved"
                    >
                      Remove
                    </button>
                  </div>

                  <h3 className="mt-3 text-base font-semibold leading-snug text-zinc-900 dark:text-white">
                    <Link
                      href={`/opportunities/${opp._id}`}
                      className="hover:underline"
                    >
                      {opp.title}
                    </Link>
                  </h3>

                  <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                    {opp.description}
                  </p>
                </div>

                <div className="mt-5 border-t border-zinc-100 pt-3.5 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400">Deadline:</span>
                    {isUrgent ? (
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        {diffDays === 0
                          ? 'Today!'
                          : `${diffDays} day${diffDays > 1 ? 's' : ''} left`}
                      </span>
                    ) : (
                      <span className="text-zinc-700 dark:text-zinc-300">
                        {deadlineDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      href={`/opportunities/${opp._id}`}
                      className="flex-1 min-h-[42px] flex items-center justify-center rounded-lg border border-zinc-200 bg-white py-2 text-center text-xs font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 touch-manipulation active:scale-[0.98] transition-all"
                    >
                      View Details
                    </Link>
                    <a
                      href={opp.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-h-[42px] flex items-center justify-center rounded-lg bg-zinc-900 py-2 text-center text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 touch-manipulation active:scale-[0.98] transition-all"
                    >
                      Apply ↗
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No saved opportunities yet"
          description="Browse available hackathons, fellowships, and internships to bookmark them for quick access."
          actionText="Explore Opportunities"
          actionHref="/explore"
        />
      )}
    </div>
  );
}
