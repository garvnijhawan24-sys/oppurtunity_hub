import { NextResponse } from 'next/server';
import { IOpportunity } from '@/lib/types';

interface DevToArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  published_at: string;
  tag_list: string[];
}

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      'https://dev.to/api/articles?tag=hackathon&per_page=6',
      {
        signal: controller.signal,
        headers: {
          'User-Agent': 'OpportunityHub-StudentProject/1.0',
        },
        next: { revalidate: 3600 },
      }
    );

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Public API returned status: ${res.status}`);
    }

    const data: DevToArticle[] = await res.json();

    const opportunities: IOpportunity[] = data.map((item, index) => {
      const pubDate = new Date(item.published_at);
      const deadlineDate = new Date(pubDate.getTime() + (14 + index * 3) * 86400000);

      return {
        _id: `ext-${item.id}`,
        title: item.title,
        description:
          item.description ||
          'Community-curated student opportunity and hackathon announcement.',
        category: 'Hackathon',
        deadline: deadlineDate.toISOString(),
        applicationLink: item.url,
        source: 'external_api',
        isFeatured: false,
        createdAt: item.published_at,
      };
    });

    return NextResponse.json({
      success: true,
      source: 'public_api',
      count: opportunities.length,
      data: opportunities,
    });
  } catch (error) {
    console.warn(
      'External API unavailable or timed out, returning curated fallback items:',
      error
    );

    const fallbackExternal: IOpportunity[] = [
      {
        _id: 'ext-fallback-1',
        title: 'Open Source Hackathon 2026 by Dev Community',
        description:
          'Global virtual challenge inviting developers to build and showcase web applications using open-source tools.',
        category: 'Hackathon',
        deadline: new Date(Date.now() + 15 * 86400000).toISOString(),
        applicationLink: 'https://dev.to/challenges',
        source: 'external_api',
        isFeatured: false,
      },
      {
        _id: 'ext-fallback-2',
        title: 'GitHub Campus Experts Student Program',
        description:
          'Enrich your campus technical community with training, resources, and mentorship provided directly by GitHub.',
        category: 'Event',
        deadline: new Date(Date.now() + 25 * 86400000).toISOString(),
        applicationLink: 'https://github.com/education/students',
        source: 'external_api',
        isFeatured: false,
      },
    ];

    return NextResponse.json({
      success: true,
      source: 'fallback_curated',
      count: fallbackExternal.length,
      data: fallbackExternal,
    });
  }
}
