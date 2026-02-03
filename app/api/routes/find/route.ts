import { NextRequest, NextResponse } from 'next/server';

// Mock route data with safety scoring
const MOCK_ROUTES = [
  {
    id: 'route-1',
    distance: '2.5 km',
    duration: '8 mins',
    safetyScore: 85,
    polyline: 'encodePolyline', // In production, get from Google Maps API
    summary: 'Via Main Road',
  },
  {
    id: 'route-2',
    distance: '2.8 km',
    duration: '9 mins',
    safetyScore: 72,
    polyline: 'encodePolyline',
    summary: 'Via Bypass',
  },
  {
    id: 'route-3',
    distance: '2.3 km',
    duration: '11 mins',
    safetyScore: 90,
    polyline: 'encodePolyline',
    summary: 'Via Well-lit Area',
  },
];

export async function POST(request: NextRequest) {
  try {
    const { origin, destination } = await request.json();

    if (!origin || !destination) {
      return NextResponse.json(
        { error: 'Origin and destination are required' },
        { status: 400 }
      );
    }

    // In production, call Google Maps Directions API
    // For now, return mock data with varying safety scores
    const routes = MOCK_ROUTES.map((route) => ({
      ...route,
      // Add slight randomization for demo
      safetyScore: Math.max(50, route.safetyScore + Math.random() * 10 - 5),
    }));

    return NextResponse.json({ routes });
  } catch (error) {
    console.error('Error finding routes:', error);
    return NextResponse.json(
      { error: 'Failed to find routes' },
      { status: 500 }
    );
  }
}
