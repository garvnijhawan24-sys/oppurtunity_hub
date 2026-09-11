import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Opportunity from '@/models/Opportunity';
import { INITIAL_OPPORTUNITIES } from '@/lib/mockData';
import { OpportunityCategory } from '@/lib/types';

async function ensureInitialData() {
  try {
    const count = await Opportunity.countDocuments();
    if (count === 0) {
      await Opportunity.insertMany(INITIAL_OPPORTUNITIES);
    }
  } catch (err) {
    console.warn('Auto-seed skipped:', err);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');

  try {
    await dbConnect();
    await ensureInitialData();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: regex }, { description: regex }];
    }

    const opportunities = await Opportunity.find(filter).sort({ deadline: 1 });

    return NextResponse.json({
      success: true,
      count: opportunities.length,
      data: opportunities,
    });
  } catch (error) {
    console.warn('MongoDB connection unavailable, using fallback dataset:', error);

    let filtered = INITIAL_OPPORTUNITIES.map((item, idx) => ({
      ...item,
      _id: `fallback-${idx + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    if (category && category !== 'All') {
      filtered = filtered.filter((item) => item.category === category);
    }

    if (featured === 'true') {
      filtered = filtered.filter((item) => item.isFeatured);
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, deadline, applicationLink } = body;

    if (!title || !description || !category || !deadline || !applicationLink) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please fill in all required fields.',
        },
        { status: 400 }
      );
    }

    const validCategories: OpportunityCategory[] = [
      'Hackathon',
      'Internship',
      'Workshop',
      'Competition',
      'Event',
    ];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid category: ${category}. Allowed categories: ${validCategories.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const urlPattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;
    if (!urlPattern.test(applicationLink)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Application link must be a valid URL starting with http:// or https://',
        },
        { status: 400 }
      );
    }

    const parsedDate = new Date(deadline);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide a valid deadline date.',
        },
        { status: 400 }
      );
    }

    await dbConnect();
    const newOpportunity = await Opportunity.create({
      title: title.trim(),
      description: description.trim(),
      category,
      deadline: parsedDate,
      applicationLink: applicationLink.trim(),
      source: 'user_submission',
      isFeatured: false,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Opportunity successfully created!',
        data: newOpportunity,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating opportunity:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Internal server error creating opportunity',
      },
      { status: 500 }
    );
  }
}
