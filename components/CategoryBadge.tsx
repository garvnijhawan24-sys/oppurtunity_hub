import React from 'react';
import { OpportunityCategory } from '@/lib/types';

interface CategoryBadgeProps {
  category: OpportunityCategory;
  className?: string;
}

export default function CategoryBadge({
  category,
  className = '',
}: CategoryBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium border border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 ${className}`}
    >
      {category}
    </span>
  );
}
