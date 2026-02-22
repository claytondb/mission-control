'use client';

import { useState } from 'react';

interface PricePoint {
  date: string;
  price: number;
}

interface FlightRoute {
  id: string;
  origin: string;
  destination: string;
  destinationName: string;
  currentPrice: number;
  lowestPrice: number;
  airline: string;
  stops: number;
  duration: string;
  priceHistory: PricePoint[];
  lastChecked: string;
  trend: 'up' | 'down' | 'stable';
}

const initialRoutes: FlightRoute[] = [
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
    priceHistory: [
      { date: '2026-02-15', price: 755 },
      { date: '2026-02-16', price: 742 },
      { date: '2026-02-17', price: 738 },
      { date: '2026-02-18', price: 725 },
      { date: '2026-02-19', price: 718 },
      { date: '2026-02-20', price: 718 },
      { date: '2026-02-21', price: 718 },
      { date: '2026-02-22', price: 718 },
    ],
    lastChecked: '2026-02-22 07:00',
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
    priceHistory: [
      { date: '2026-02-15', price: 899 },
      { date: '2026-02-16', price: 885 },
      { date: '2026-02-17', price: 865 },
      { date: '2026-02-18', price: 855 },
      { date: '2026-02-19', price: 835 },
      { date: '2026-02-20', price: 835 },
      { date: '2026-02-21', price: 825 },
      { date: '2026-02-22', price: 825 },
    ],
    lastChecked: '2026-02-22 07:00',
    trend: 'down',
  },
];

export default function FlightMonitor() {
  const [routes] = useState<FlightRoute[]>(initialRoutes);
  const [alertPrice, setAlertPrice] = useState<string>('');
  const [selectedRoute, setSelectedRoute] = useState<string>('1');

  const activeRoute = routes.find(r => r.id === selectedRoute)!;
  const maxPrice = Math.max(...activeRoute.priceHistory.map(p => p.price));
  const minPrice = Math.min(...activeRoute.priceHistory.map(p => p.price));
  const priceRange = maxPrice - minPrice || 1;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-red-400';
      case 'down': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div>
      {/* Route Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {routes.map((route) => (
          <button
            key={route.id}
            onClick={() => setSelectedRoute(route.id)}
            className={`card text-left transition-all ${
              selectedRoute === route.id ? 'border-[var(--accent)]' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-2xl mb-1">🌺</div>
                <div className="font-bold text-lg">{route.destinationName}</div>
                <div className="text-sm text-[var(--muted)]">
                  {route.origin} → {route.destination}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${getTrendColor(route.trend)}`}>
                  ${route.currentPrice}
                </div>
                <div className="text-sm text-[var(--muted)] flex items-center justify-end gap-1">
                  {getTrendIcon(route.trend)}
                  <span className={getTrendColor(route.trend)}>
                    {route.trend === 'down' ? 'Dropping' : route.trend === 'up' ? 'Rising' : 'Stable'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-between text-sm text-[var(--muted)]">
              <span>{route.airline} • {route.stops} stop{route.stops > 1 ? 's' : ''}</span>
              <span>{route.duration}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Price Chart */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Price History - {activeRoute.destinationName}</h3>
          <div className="text-sm text-[var(--muted)]">
            Lowest seen: <span className="text-[var(--success)]">${activeRoute.lowestPrice}</span>
          </div>
        </div>
        
        {/* Simple bar chart */}
        <div className="flex items-end gap-2 h-40 mb-4">
          {activeRoute.priceHistory.map((point, i) => {
            const height = ((point.price - minPrice) / priceRange) * 100 + 20;
            const isLatest = i === activeRoute.priceHistory.length - 1;
            return (
              <div key={point.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-[var(--muted)]">${point.price}</span>
                <div
                  className={`w-full rounded-t transition-all ${
                    isLatest ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
                  }`}
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-[var(--muted)]">
                  {point.date.split('-').slice(1).join('/')}
                </span>
              </div>
            );
          })}
        </div>

        <div className="text-sm text-[var(--muted)] text-center">
          Last checked: {activeRoute.lastChecked}
        </div>
      </div>

      {/* Price Alert */}
      <div className="card">
        <h3 className="font-semibold mb-4">Price Alert</h3>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm text-[var(--muted)] mb-1 block">
              Alert me when price drops below:
            </label>
            <div className="flex gap-2">
              <span className="input w-12 text-center bg-[var(--border)]">$</span>
              <input
                type="number"
                className="input flex-1"
                placeholder="e.g., 650"
                value={alertPrice}
                onChange={(e) => setAlertPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-end">
            <button className="btn btn-primary">
              Set Alert
            </button>
          </div>
        </div>
        <p className="text-sm text-[var(--muted)] mt-3">
          You&apos;ll receive a notification when {activeRoute.destinationName} flights drop below your target price.
        </p>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <div className="font-medium mb-1">Booking Tips</div>
            <ul className="text-sm text-[var(--muted)] space-y-1">
              <li>• Best prices typically appear Tuesday-Wednesday</li>
              <li>• Book 6-8 weeks ahead for optimal pricing</li>
              <li>• Consider flying into Kona ($718) and island-hopping to Hilo</li>
              <li>• Southwest bags fly free (2 checked bags included)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
