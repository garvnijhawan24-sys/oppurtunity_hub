import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Opportunity from '@/models/Opportunity';
import { INITIAL_OPPORTUNITIES } from '@/lib/mockData';

export async function POST() {
  try {
    await dbConnect();

    const count = await Opportunity.countDocuments();
    if (count > 0) {
      return NextResponse.json(
        {
          success: true,
          message: `Database already contains ${count} opportunities. No seeding needed.`,
          count,
        },
        { status: 200 }
      );
    }

    const created = await Opportunity.insertMany(INITIAL_OPPORTUNITIES);

    return NextResponse.json(
      {
        success: true,
        message: `Successfully seeded ${created.length} opportunities into MongoDB.`,
        count: created.length,
        data: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred during seeding.',
      },
      { status: 500 }
    );
  }
}
