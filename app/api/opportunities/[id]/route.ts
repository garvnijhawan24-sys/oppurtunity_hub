import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Opportunity from '@/models/Opportunity';
import SavedOpportunity from '@/models/SavedOpportunity';
import { INITIAL_OPPORTUNITIES } from '@/lib/mockData';
import mongoose from 'mongoose';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    if (id.startsWith('fallback-')) {
      const idx = parseInt(id.replace('fallback-', ''), 10) - 1;
      const found = INITIAL_OPPORTUNITIES[idx];
      if (found) {
        return NextResponse.json({
          success: true,
          data: { ...found, _id: id },
        });
      }
      return NextResponse.json(
        { success: false, error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid opportunity ID format' },
        { status: 400 }
      );
    }

    await dbConnect();
    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return NextResponse.json(
        { success: false, error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: opportunity,
    });
  } catch (error) {
    console.error('Error fetching opportunity by ID:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error fetching opportunity',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid opportunity ID format' },
        { status: 400 }
      );
    }

    await dbConnect();

    const deleted = await Opportunity.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    await SavedOpportunity.deleteMany({ opportunityId: id });

    return NextResponse.json({
      success: true,
      message: 'Opportunity deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error deleting opportunity',
      },
      { status: 500 }
    );
  }
}
