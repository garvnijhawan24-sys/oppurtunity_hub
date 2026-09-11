import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import SavedOpportunity from '@/models/SavedOpportunity';
import Opportunity from '@/models/Opportunity';
import { INITIAL_OPPORTUNITIES } from '@/lib/mockData';
import mongoose from 'mongoose';

const DEFAULT_USER_ID = 'guest_user';

export async function GET() {
  try {
    await dbConnect();

    const saved = await SavedOpportunity.find({ userId: DEFAULT_USER_ID })
      .populate('opportunityId')
      .sort({ savedAt: -1 });

    return NextResponse.json({
      success: true,
      count: saved.length,
      data: saved,
    });
  } catch (error) {
    console.warn('MongoDB offline in /api/saved GET, returning empty array:', error);
    return NextResponse.json({
      success: true,
      count: 0,
      data: [],
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { opportunityId } = body;

    if (!opportunityId) {
      return NextResponse.json(
        { success: false, error: 'Opportunity ID is required' },
        { status: 400 }
      );
    }

    if (String(opportunityId).startsWith('fallback-')) {
      const idx = parseInt(opportunityId.replace('fallback-', ''), 10) - 1;
      const found = INITIAL_OPPORTUNITIES[idx];
      return NextResponse.json(
        {
          success: true,
          message: 'Saved in offline preview mode',
          data: {
            _id: `saved-${Date.now()}`,
            userId: DEFAULT_USER_ID,
            opportunityId: { ...found, _id: opportunityId },
            savedAt: new Date().toISOString(),
          },
        },
        { status: 201 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(opportunityId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Opportunity ID' },
        { status: 400 }
      );
    }

    await dbConnect();

    const exists = await Opportunity.findById(opportunityId);
    if (!exists) {
      return NextResponse.json(
        { success: false, error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    const alreadySaved = await SavedOpportunity.findOne({
      userId: DEFAULT_USER_ID,
      opportunityId,
    });

    if (alreadySaved) {
      return NextResponse.json(
        { success: false, error: 'Opportunity is already saved in your dashboard' },
        { status: 409 }
      );
    }

    const savedRecord = await SavedOpportunity.create({
      userId: DEFAULT_USER_ID,
      opportunityId,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Opportunity saved successfully',
        data: savedRecord,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving opportunity:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Error saving opportunity',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    let opportunityId: string | null = null;

    const { searchParams } = new URL(request.url);
    opportunityId = searchParams.get('opportunityId');

    if (!opportunityId) {
      try {
        const body = await request.json();
        opportunityId = body.opportunityId;
      } catch {
      }
    }

    if (!opportunityId) {
      return NextResponse.json(
        { success: false, error: 'Opportunity ID is required' },
        { status: 400 }
      );
    }

    if (opportunityId.startsWith('fallback-')) {
      return NextResponse.json({
        success: true,
        message: 'Removed from offline preview',
      });
    }

    await dbConnect();

    await SavedOpportunity.deleteOne({
      userId: DEFAULT_USER_ID,
      opportunityId,
    });

    return NextResponse.json({
      success: true,
      message: 'Opportunity removed from saved list',
    });
  } catch (error) {
    console.error('Error deleting saved opportunity:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error removing saved opportunity',
      },
      { status: 500 }
    );
  }
}
