'use client';

import React from 'react';
import { CATEGORIES } from '@/lib/types';

interface FilterBarProps {
  selectedCategory: string;
  searchQuery: string;
  onSelectCategory: (category: string) => void;
  onSearchChange: (query: string) => void;
  totalResults: number;
}

export default function FilterBar({
  selectedCategory,
  searchQuery,
  onSelectCategory,
  onSearchChange,
  totalResults,
}: FilterBarProps) {
  const allCategories = ['All', ...CATEGORIES];

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search opportunities by title, topic, or keyword..."
          className="w-full min-h-[44px] rounded-xl border border-zinc-300 bg-white py-2.5 pl-10 pr-11 text-base sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-400 dark:focus:border-zinc-200 dark:focus:ring-zinc-200 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 flex h-full w-11 items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 active:scale-90 transition-transform"
            aria-label="Clear search"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Category Pills & Count Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
          {allCategories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`rounded-lg px-3.5 py-2 sm:py-1.5 text-xs font-medium min-h-[38px] sm:min-h-0 shrink-0 touch-manipulation active:scale-95 transition-all duration-150 ${
                  isSelected
                    ? 'bg-zinc-900 text-white shadow-xs dark:bg-white dark:text-zinc-900 font-semibold'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-zinc-600 dark:text-zinc-300 font-mono shrink-0">
          Showing <span className="font-semibold text-zinc-900 dark:text-white">{totalResults}</span> opportunit{totalResults === 1 ? 'y' : 'ies'}
        </div>
      </div>
    </div>
  );
}
