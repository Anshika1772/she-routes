export async function GET() {
  const hasApiKey = !!process.env.GOOGLE_MAPS_API_KEY;

  return Response.json({
    hasApiKey,
    message: hasApiKey ? 'Google Maps API configured' : 'Using mock data mode',
  });
}
