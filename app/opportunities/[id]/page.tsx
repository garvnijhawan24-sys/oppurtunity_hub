'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { IOpportunity } from '@/lib/types';
import CategoryBadge from '@/components/CategoryBadge';

export default function OpportunityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [opportunity, setOpportunity] = useState<IOpportunity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOpportunity() {
      if (!id) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/opportunities/${id}`);
        const data = await res.json();

        if (data.success && data.data) {
          setOpportunity(data.data);
        } else {
          setError(data.error || 'Opportunity not found');
        }

        // Check if saved
        const savedRes = await fetch('/api/saved');
        const savedData = await savedRes.json();
        if (savedData.success && Array.isArray(savedData.data)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const exists = savedData.data.some((item: any) => {
            const oppId =
              typeof item.opportunityId === 'object'
                ? item.opportunityId._id
                : item.opportunityId;
            return oppId === id;
          });
          setIsSaved(exists);
        }
      } catch (err) {
        console.error('Error loading opportunity:', err);
        setError('Failed to fetch opportunity details.');
      } finally {
        setLoading(false);
      }
    }

    loadOpportunity();
  }, [id]);

  const handleToggleBookmark = async () => {
    if (!opportunity) return;
    const nextState = !isSaved;
    setIsSaved(nextState);

    try {
      if (nextState) {
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
      window.dispatchEvent(new Event('bookmark-updated'));
    } catch {
      setIsSaved(!nextState);
    }
  };

  const handleDelete = async () => {
    if (!opportunity) return;
    if (!confirm('Are you sure you want to delete this opportunity?')) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/opportunities/${opportunity._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        router.push('/explore');
      } else {
        alert(data.error || 'Failed to delete opportunity');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error occurred while deleting.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 space-y-6 max-w-4xl mx-auto animate-pulse">
        <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-8 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="h-48 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-4">
        <div className="text-3xl">🔍</div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
          Opportunity Not Found
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          The opportunity you are looking for may have been removed or does not exist.
        </p>
        <Link
          href="/explore"
          className="inline-block rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-zinc-900"
        >
          &larr; Back to Explore
        </Link>
      </div>
    );
  }

  const deadlineDate = new Date(opportunity.deadline);
  const diffDays = Math.ceil(
    (deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-6">
      {/* Back navigation */}
      <Link
        href="/explore"
        className="inline-flex items-center gap-1.5 min-h-[38px] px-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white touch-manipulation active:scale-95 transition-all"
      >
        <span>&larr;</span>
        <span>Back to all opportunities</span>
      </Link>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Details & Body */}
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CategoryBadge category={opportunity.category} />
              {opportunity.source === 'external_api' && (
                <span className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-mono text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  Public Feed
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              {opportunity.title}
            </h1>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Program Overview
            </h2>
            <div className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
              {opportunity.description}
            </div>
          </div>
        </div>

        {/* Right Column: Application Quick Facts Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Key Dates & Actions
            </h3>

            {/* Deadline status */}
            <div className="space-y-1">
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Application Deadline
              </div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                {deadlineDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              {diffDays >= 0 && diffDays <= 3 ? (
                <div className="inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400 mt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                  <span>
                    {diffDays === 0 ? 'Due today!' : `Closing in ${diffDays} day${diffDays > 1 ? 's' : ''}!`}
                  </span>
                </div>
              ) : diffDays < 0 ? (
                <div className="text-xs text-zinc-400 dark:text-zinc-500">
                  Applications closed
                </div>
              ) : (
                <div className="text-xs text-emerald-600 dark:text-emerald-400">
                  {diffDays} days remaining
                </div>
              )}
            </div>

            {/* Direct External Link CTA */}
            <a
              href={opportunity.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full min-h-[46px] items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 active:scale-[0.98] dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 touch-manipulation transition-all text-center"
            >
              <span>Apply on Official Website</span>
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>

            {/* Bookmark button */}
            <button
              onClick={handleToggleBookmark}
              className={`flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium touch-manipulation active:scale-[0.98] transition-all ${
                isSaved
                  ? 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              <svg
                className="h-3.5 w-3.5"
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
              <span>{isSaved ? 'Saved in Dashboard' : 'Save for Later'}</span>
            </button>

            {/* Optional Delete Button */}
            {!id.startsWith('ext-') && (
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full min-h-[38px] flex items-center justify-center text-center text-[11px] text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 touch-manipulation active:scale-95 transition-all"
                >
                  {deleting ? 'Deleting...' : 'Delete Opportunity'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
