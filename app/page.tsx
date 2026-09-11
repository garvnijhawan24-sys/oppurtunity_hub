'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IOpportunity, CATEGORIES } from '@/lib/types';
import OpportunityCard from '@/components/OpportunityCard';
import SkeletonCard from '@/components/SkeletonCard';

export default function HomePage() {
  const [featured, setFeatured] = useState<IOpportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch('/api/opportunities?featured=true');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setFeatured(data.data.slice(0, 4));
        }

        const savedRes = await fetch('/api/saved');
        const savedData = await savedRes.json();
        if (savedData.success && Array.isArray(savedData.data)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const ids = savedData.data.map((item: any) =>
            typeof item.opportunityId === 'object'
              ? item.opportunityId._id
              : item.opportunityId
          );
          setSavedIds(ids);
        }
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-16 py-4">
      <section className="relative text-center max-w-3xl mx-auto pt-8 pb-4 space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Curated for College Students & Developers</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Find Your Next Opportunity
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          Discover hackathons, internships, hands-on workshops, and competitions
          in one centralized hub. Never miss an application deadline again.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
          <Link
            href="/explore"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-zinc-800 active:scale-[0.98] dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 touch-manipulation transition-all text-center"
          >
            Explore All Opportunities
          </Link>
          <Link
            href="/add"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 shadow-2xs hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 touch-manipulation transition-all text-center"
          >
            Submit an Opportunity
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <div className="text-center">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Browse by Focus Area
          </h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/explore?category=${cat}`}
              className="inline-flex items-center justify-center min-h-[40px] rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-700 shadow-2xs hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-white touch-manipulation active:scale-95 transition-all"
            >
              {cat}s
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Featured Opportunities
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Top upcoming programs closing soon for applications
            </p>
          </div>
          <Link
            href="/explore"
            className="text-xs font-semibold text-zinc-900 hover:underline dark:text-zinc-200 inline-flex items-center gap-1"
          >
            <span>View all</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((item) => (
              <OpportunityCard
                key={item._id}
                opportunity={item}
                isInitiallySaved={savedIds.includes(item._id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            No featured opportunities available at this time.
          </div>
        )}
      </section>

      <section className="border-t border-zinc-200 pt-12 dark:border-zinc-800">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1.5">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            Designed for Student Developers
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Engineered simply to solve the scattered links problem across Discord and WhatsApp groups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-200 text-sm font-semibold mb-3">
              01
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Zero Noise or Spam
            </h3>
            <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Every listing is explicitly categorized with a verified title, description, and direct registration URL.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-200 text-sm font-semibold mb-3">
              02
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Urgency & Deadlines
            </h3>
            <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Automated countdown tags highlight programs expiring within 3 days so you never miss an application cutoff.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-200 text-sm font-semibold mb-3">
              03
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Personal Dashboard
            </h3>
            <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Bookmark interesting opportunities with one click and organize your submission calendar in your personal dashboard.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}