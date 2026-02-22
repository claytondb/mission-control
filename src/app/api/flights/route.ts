import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// Store flight data in a JSON file (in production, use a database)
const DATA_FILE = join(process.cwd(), 'flight-data.json');

interface FlightData {
  routes: {
    id: string;
    origin: string;
    destination: string;
    destinationName: string;
    currentPrice: number;
    lowestPrice: number;
    airline: string;
    stops: number;
    duration: string;
    priceHistory: { date: string; price: number }[];
    lastChecked: string;
    trend: 'up' | 'down' | 'stable';
  }[];
  lastUpdated: string;
}

const defaultData: FlightData = {
  routes: [
    {
      id: '1',
      origin: 'ORD',
      destination: 'KOA',
      destinationName: 'Kona',
      currentPrice: 718,
      lowestPrice: 698,
      airline: 'Delta',
      stops: 1,
      duration: '16h 13min',
      priceHistory: [],
      lastChecked: new Date().toISOString(),
      trend: 'stable',
    },
    {
      id: '2',
      origin: 'ORD',
      destination: 'ITO',
      destinationName: 'Hilo',
      currentPrice: 825,
      lowestPrice: 799,
      airline: 'Southwest',
      stops: 2,
      duration: '16h 55min',
      priceHistory: [],
      lastChecked: new Date().toISOString(),
      trend: 'down',
    },
  ],
  lastUpdated: new Date().toISOString(),
};

function getData(): FlightData {
  try {
    if (existsSync(DATA_FILE)) {
      const content = readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Error reading flight data:', e);
  }
  return defaultData;
}

function saveData(data: FlightData) {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error saving flight data:', e);
  }
}

// GET - Return current flight data
export async function GET() {
  const data = getData();
  return NextResponse.json(data);
}

// POST - Update flight prices (called by cron/Nero)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { routeId, price, airline, stops, duration } = body;

    // Simple API key check (in production, use proper auth)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.FLIGHT_API_KEY || 'nero-update-key'}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = getData();
    const route = data.routes.find(r => r.id === routeId);

    if (!route) {
      return NextResponse.json({ error: 'Route not found' }, { status: 404 });
    }

    const today = new Date().toISOString().split('T')[0];
    const oldPrice = route.currentPrice;

    // Update route
    route.currentPrice = price;
    if (airline) route.airline = airline;
    if (stops !== undefined) route.stops = stops;
    if (duration) route.duration = duration;
    route.lastChecked = new Date().toISOString();

    // Update lowest price if needed
    if (price < route.lowestPrice) {
      route.lowestPrice = price;
    }

    // Determine trend
    if (price < oldPrice) {
      route.trend = 'down';
    } else if (price > oldPrice) {
      route.trend = 'up';
    } else {
      route.trend = 'stable';
    }

    // Add to price history (keep last 14 days)
    const existingToday = route.priceHistory.findIndex(p => p.date === today);
    if (existingToday >= 0) {
      route.priceHistory[existingToday].price = price;
    } else {
      route.priceHistory.push({ date: today, price });
    }
    route.priceHistory = route.priceHistory.slice(-14);

    data.lastUpdated = new Date().toISOString();
    saveData(data);

    return NextResponse.json({ 
      success: true, 
      route: {
        id: route.id,
        destination: route.destinationName,
        oldPrice,
        newPrice: price,
        trend: route.trend,
      }
    });
  } catch (e) {
    console.error('Error updating flight data:', e);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
