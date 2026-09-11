'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { IOpportunity } from '@/lib/types';
import FilterBar from '@/components/FilterBar';
import OpportunityCard from '@/components/OpportunityCard';
import SkeletonCard from '@/components/SkeletonCard';
import EmptyState from '@/components/EmptyState';

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'All';

  const [opportunities, setOpportunities] = useState<IOpportunity[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [includeExternal, setIncludeExternal] = useState<boolean>(true);
  const [externalOpportunities, setExternalOpportunities] = useState<IOpportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchOpportunities() {
      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'All') {
          queryParams.set('category', selectedCategory);
        }
        if (searchQuery.trim()) {
          queryParams.set('search', searchQuery.trim());
        }

        const res = await fetch(`/api/opportunities?${queryParams.toString()}`);
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.data)) {
          setOpportunities(data.data);
        }

        const savedRes = await fetch('/api/saved');
        const savedData = await savedRes.json();
        if (isMounted && savedData.success && Array.isArray(savedData.data)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const ids = savedData.data.map((item: any) =>
            typeof item.opportunityId === 'object'
              ? item.opportunityId._id
              : item.opportunityId
          );
          setSavedIds(ids);
        }
      } catch (err) {
        console.error('Error fetching explore opportunities:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchOpportunities();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    let isMounted = true;
    async function fetchExternalData() {
      try {
        const res = await fetch('/api/external');
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.data)) {
          setExternalOpportunities(data.data);
        }
      } catch (err) {
        console.warn('External API feed skipped:', err);
      }
    }

    fetchExternalData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectCategory = (cat: string) => {
    if (cat === 'All') {
      router.push('/explore');
    } else {
      router.push(`/explore?category=${encodeURIComponent(cat)}`);
    }
  };

  const combinedList = useMemo(() => {
    let list = [...opportunities];
    if (includeExternal && externalOpportunities.length > 0) {
      let filteredExt = externalOpportunities;
      if (selectedCategory && selectedCategory !== 'All') {
        filteredExt = filteredExt.filter((i) => i.category === selectedCategory);
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        filteredExt = filteredExt.filter(
          (i) =>
            i.title.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q)
        );
      }
      list = [...list, ...filteredExt];
    }
    return list;
  }, [opportunities, externalOpportunities, includeExternal, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8 py-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Explore Opportunities
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
            Browse verified hackathons, internships, workshops, and competitions
          </p>
        </div>

        <label className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-200 cursor-pointer self-start md:self-auto bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <input
            type="checkbox"
            checked={includeExternal}
            onChange={(e) => setIncludeExternal(e.target.checked)}
            className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-700"
          />
          <span className="font-medium">Include Public Dev Community Events</span>
        </label>
      </div>

      {/* Filter & Search Bar */}
      <FilterBar
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onSelectCategory={handleSelectCategory}
        onSearchChange={setSearchQuery}
        totalResults={combinedList.length}
      />

      {/* Opportunities Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : combinedList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {combinedList.map((opp) => (
            <OpportunityCard
              key={opp._id}
              opportunity={opp}
              isInitiallySaved={savedIds.includes(opp._id)}
              onBookmarkToggle={(id, saved) => {
                setSavedIds((prev) =>
                  saved ? [...prev, id] : prev.filter((item) => item !== id)
                );
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No opportunities found"
          description={`No results matched your search "${searchQuery}" in category "${selectedCategory}". Try clearing your filters.`}
          actionText="Reset All Filters"
          onActionClick={() => {
            handleSelectCategory('All');
            setSearchQuery('');
          }}
        />
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 py-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
