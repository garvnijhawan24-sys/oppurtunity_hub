'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES, OpportunityFormData } from '@/lib/types';

export default function AddOpportunityPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<OpportunityFormData>({
    title: '',
    category: 'Hackathon',
    deadline: '',
    applicationLink: '',
    description: '',
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.title.trim()) {
      setErrorMessage('Please enter an opportunity title.');
      return;
    }

    if (formData.title.trim().length < 3) {
      setErrorMessage('Title must be at least 3 characters.');
      return;
    }

    if (!formData.deadline) {
      setErrorMessage('Please choose an application deadline date.');
      return;
    }

    if (!formData.applicationLink.trim()) {
      setErrorMessage('Please provide an application or registration URL.');
      return;
    }

    if (
      !formData.applicationLink.startsWith('http://') &&
      !formData.applicationLink.startsWith('https://')
    ) {
      setErrorMessage('Application URL must start with http:// or https://');
      return;
    }

    if (formData.description.trim().length < 10) {
      setErrorMessage('Please write a description of at least 10 characters.');
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit opportunity.');
      }

      setSuccessMessage('Opportunity posted successfully! Redirecting to Explore...');
      setTimeout(() => {
        router.push('/explore');
      }, 1500);
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage(
        err instanceof Error ? err.message : 'An error occurred during submission.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-6 max-w-2xl mx-auto space-y-6">
      {/* Back Link */}
      <Link
        href="/explore"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
      >
        <span>&larr;</span>
        <span>Back to opportunities</span>
      </Link>

      <div className="border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Post an Opportunity
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Share a hackathon, student internship, workshop, or competition with the community.
        </p>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          ⚠️ {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          ✅ {successMessage}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-5"
      >
        {/* Title */}
        <div className="space-y-1.5">
          <label
            htmlFor="title"
            className="block text-xs font-semibold text-zinc-900 dark:text-zinc-200"
          >
            Opportunity Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Smart India Hackathon 2026"
            className="w-full min-h-[44px] rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-base sm:text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-zinc-300 dark:focus:ring-zinc-300 transition-colors"
          />
        </div>

        {/* Category & Deadline Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="category"
              className="block text-xs font-semibold text-zinc-900 dark:text-zinc-200"
            >
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full min-h-[44px] rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-base sm:text-xs text-zinc-900 focus:border-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-300 dark:focus:ring-zinc-300 transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="deadline"
              className="block text-xs font-semibold text-zinc-900 dark:text-zinc-200"
            >
              Application Deadline <span className="text-red-500">*</span>
            </label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              required
              value={formData.deadline}
              onChange={handleChange}
              className="w-full min-h-[44px] rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-base sm:text-xs text-zinc-900 focus:border-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-300 dark:focus:ring-zinc-300 transition-colors"
            />
          </div>
        </div>

        {/* Application Link */}
        <div className="space-y-1.5">
          <label
            htmlFor="applicationLink"
            className="block text-xs font-semibold text-zinc-900 dark:text-zinc-200"
          >
            Official Application URL <span className="text-red-500">*</span>
          </label>
          <input
            id="applicationLink"
            name="applicationLink"
            type="url"
            required
            value={formData.applicationLink}
            onChange={handleChange}
            placeholder="https://example.com/apply"
            className="w-full min-h-[44px] rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-base sm:text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-zinc-300 dark:focus:ring-zinc-300 transition-colors"
          />
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
            Must start with http:// or https:// (e.g., https://unstop.com or https://mlh.io)
          </p>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label
            htmlFor="description"
            className="block text-xs font-semibold text-zinc-900 dark:text-zinc-200"
          >
            Description & Eligibility <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide key program details, eligible degrees/years, prizes or stipend, format (online or in-person)..."
            className="w-full rounded-xl border border-zinc-200 bg-white p-3.5 text-base sm:text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-zinc-300 dark:focus:ring-zinc-300 transition-colors resize-y"
          />
        </div>

        {/* Submit CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end gap-3">
          <Link
            href="/explore"
            className="min-h-[44px] inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white touch-manipulation active:scale-95 transition-all text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="min-h-[44px] inline-flex items-center justify-center rounded-xl bg-zinc-900 px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 active:scale-98 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 touch-manipulation transition-all"
          >
            {submitting ? 'Publishing...' : 'Publish Opportunity'}
          </button>
        </div>
      </form>
    </div>
  );
}
