import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { origin, destination, route } = await request.json();

    if (!origin || !destination || !route) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save route to database
    const { data, error } = await supabase
      .from('saved_routes')
      .insert({
        user_id: user.id,
        origin,
        destination,
        distance: route.distance,
        duration: route.duration,
        safety_score: route.safetyScore,
        polyline: route.polyline,
        summary: route.summary,
      });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save route' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Route saved successfully',
      data,
    });
  } catch (error) {
    console.error('Error saving route:', error);
    return NextResponse.json(
      { error: 'Failed to save route' },
      { status: 500 }
    );
  }
}
