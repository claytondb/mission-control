import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const PROJECTS_KEY = 'mission-control:projects';

export interface Project {
  id: string;
  name: string;
  type: 'app' | 'game' | 'website';
  description: string;
  status: 'live' | 'building' | 'idea' | 'paused';
  priority: 'high' | 'medium' | 'low';
  revenue: string;
  url?: string;
  repo?: string;
  localPath?: string;
  nextAction?: string;
  lastUpdated?: string;
}

// GET - Fetch all projects
export async function GET() {
  try {
    // Check if Redis is configured
    if (!process.env.UPSTASH_REDIS_REST_URL) {
      return NextResponse.json({ 
        error: 'Database not configured',
        useLocalStorage: true 
      }, { status: 503 });
    }

    const projects = await redis.get<Project[]>(PROJECTS_KEY);
    
    if (!projects) {
      return NextResponse.json({ projects: [], initialized: false });
    }

    return NextResponse.json({ projects, initialized: true });
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch projects',
      useLocalStorage: true 
    }, { status: 500 });
  }
}

// POST - Save all projects
export async function POST(request: Request) {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL) {
      return NextResponse.json({ 
        error: 'Database not configured' 
      }, { status: 503 });
    }

    const { projects } = await request.json();
    
    if (!Array.isArray(projects)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    await redis.set(PROJECTS_KEY, projects);

    return NextResponse.json({ success: true, count: projects.length });
  } catch (error) {
    console.error('Failed to save projects:', error);
    return NextResponse.json({ 
      error: 'Failed to save projects' 
    }, { status: 500 });
  }
}

// PATCH - Update a single project
export async function PATCH(request: Request) {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL) {
      return NextResponse.json({ 
        error: 'Database not configured' 
      }, { status: 503 });
    }

    const { id, updates } = await request.json();
    
    if (!id || !updates) {
      return NextResponse.json({ error: 'Missing id or updates' }, { status: 400 });
    }

    const projects = await redis.get<Project[]>(PROJECTS_KEY) || [];
    const index = projects.findIndex(p => p.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    projects[index] = { 
      ...projects[index], 
      ...updates,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    await redis.set(PROJECTS_KEY, projects);

    return NextResponse.json({ success: true, project: projects[index] });
  } catch (error) {
    console.error('Failed to update project:', error);
    return NextResponse.json({ 
      error: 'Failed to update project' 
    }, { status: 500 });
  }
}
