import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export async function GET() {
  const hasUrl = !!process.env.UPSTASH_REDIS_REST_URL;
  const hasToken = !!process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!hasUrl || !hasToken) {
    return NextResponse.json({
      status: 'not_configured',
      hasUrl,
      hasToken,
      message: 'Missing environment variables. Make sure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set in Vercel.',
    });
  }

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    // Test connection
    await redis.ping();

    return NextResponse.json({
      status: 'connected',
      hasUrl: true,
      hasToken: true,
      message: 'Database connected successfully!',
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      hasUrl: true,
      hasToken: true,
      message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}
