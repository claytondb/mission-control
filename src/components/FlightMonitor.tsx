'use client';

import { useState, useEffect } from 'react';

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
  searchUrl: string;
}

interface PriceAlert {
  routeId: string;
  targetPrice: number;
  createdAt: string;
  triggered: boolean;
}

const ALERTS_STORAGE_KEY = 'mission-control-flight-alerts';
const ROUTES_STORAGE_KEY = 'mission-control-flight-routes';

// Trip dates: March 20-29, 2026
const DEPART_DATE = '2026-03-20';
const RETURN_DATE = '2026-03-29';

// Generate Google Flights URL
function getGoogleFlightsUrl(origin: string, destination: string): string {
  return `https://www.google.com/travel/flights?q=flights%20from%20${origin}%20to%20${destination}%20${DEPART_DATE}%20to%20${RETURN_DATE}`;
}

const defaultRoutes: FlightRoute[] = [
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
    searchUrl: getGoogleFlightsUrl('ORD', 'KOA'),
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
    searchUrl: getGoogleFlightsUrl('ORD', 'ITO'),
  },
];

export default function FlightMonitor() {
  const [routes, setRoutes] = useState<FlightRoute[]>(defaultRoutes);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [alertPrice, setAlertPrice] = useState<string>('');
  const [selectedRoute, setSelectedRoute] = useState<string>('1');
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [triggeredAlerts, setTriggeredAlerts] = useState<PriceAlert[]>([]);

  // Load from localStorage and API
  useEffect(() => {
    const savedAlerts = localStorage.getItem(ALERTS_STORAGE_KEY);
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    }
    
    // Fetch latest prices from API
    fetch('/api/flights')
      .then(res => res.json())
      .then(data => {
        if (data.routes && data.routes.length > 0) {
          // Merge API data with search URLs
          const updatedRoutes = data.routes.map((route: FlightRoute) => ({
            ...route,
            searchUrl: getGoogleFlightsUrl(route.origin, route.destination),
          }));
          setRoutes(updatedRoutes);
          localStorage.setItem(ROUTES_STORAGE_KEY, JSON.stringify(updatedRoutes));
        }
      })
      .catch(err => {
        console.error('Failed to fetch flight data:', err);
        // Fall back to localStorage
        const savedRoutes = localStorage.getItem(ROUTES_STORAGE_KEY);
        if (savedRoutes) {
          setRoutes(JSON.parse(savedRoutes));
        }
      });
  }, []);

  // Save alerts to localStorage
  useEffect(() => {
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
  }, [alerts]);

  // Check for triggered alerts
  useEffect(() => {
    const triggered = alerts.filter(alert => {
      const route = routes.find(r => r.id === alert.routeId);
      return route && route.currentPrice <= alert.targetPrice && !alert.triggered;
    });
    
    if (triggered.length > 0) {
      setTriggeredAlerts(triggered);
      // Mark alerts as triggered
      setAlerts(alerts.map(a => 
        triggered.find(t => t.routeId === a.routeId && t.targetPrice === a.targetPrice)
          ? { ...a, triggered: true }
          : a
      ));
    }
  }, [routes, alerts]);

  const activeRoute = routes.find(r => r.id === selectedRoute)!;
  const activeAlert = alerts.find(a => a.routeId === selectedRoute && !a.triggered);
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

  const setAlert = () => {
    const price = parseInt(alertPrice);
    if (isNaN(price) || price <= 0) return;

    // Remove existing alert for this route
    const newAlerts = alerts.filter(a => a.routeId !== selectedRoute);
    
    newAlerts.push({
      routeId: selectedRoute,
      targetPrice: price,
      createdAt: new Date().toISOString(),
      triggered: false,
    });
    
    setAlerts(newAlerts);
    setAlertPrice('');
    setShowAlertSuccess(true);
    setTimeout(() => setShowAlertSuccess(false), 3000);
  };

  const removeAlert = (routeId: string) => {
    setAlerts(alerts.filter(a => a.routeId !== routeId));
  };

  const dismissTriggeredAlert = (alert: PriceAlert) => {
    setTriggeredAlerts(triggeredAlerts.filter(a => 
      !(a.routeId === alert.routeId && a.targetPrice === alert.targetPrice)
    ));
  };

  const isAlertTriggered = (routeId: string) => {
    const alert = alerts.find(a => a.routeId === routeId);
    const route = routes.find(r => r.id === routeId);
    return alert && route && route.currentPrice <= alert.targetPrice;
  };

  return (
    <div>
      {/* Triggered Alerts Banner */}
      {triggeredAlerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {triggeredAlerts.map((alert) => {
            const route = routes.find(r => r.id === alert.routeId);
            if (!route) return null;
            return (
              <div 
                key={`${alert.routeId}-${alert.targetPrice}`}
                className="card bg-green-500/20 border-green-500 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <div className="font-semibold text-green-400">
                      Price Alert Triggered!
                    </div>
                    <div className="text-sm">
                      {route.destinationName} dropped to ${route.currentPrice} (your target: ${alert.targetPrice})
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={route.searchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary text-sm"
                  >
                    Book Now →
                  </a>
                  <button 
                    className="btn btn-ghost text-sm"
                    onClick={() => dismissTriggeredAlert(alert)}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Trip Dates Banner */}
      <div className="card mb-4 bg-[var(--accent)]/10 border-[var(--accent)]/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">📅</span>
          <div>
            <span className="font-medium">Trip Dates:</span>
            <span className="ml-2">March 20 - 29, 2026</span>
            <span className="text-[var(--muted)] ml-2">(9 nights)</span>
          </div>
        </div>
      </div>

      {/* Route Cards */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {routes.map((route) => (
          <div
            key={route.id}
            className={`card transition-all ${
              selectedRoute === route.id ? 'border-[var(--accent)]' : ''
            } ${isAlertTriggered(route.id) ? 'border-green-500 bg-green-500/10' : ''}`}
          >
            <button
              onClick={() => setSelectedRoute(route.id)}
              className="text-left w-full"
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
            
            {/* Quick Links */}
            <div className="flex gap-2 mt-3 pt-3 border-t border-[var(--border)]">
              <a
                href={route.searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost text-xs flex-1 text-center"
              >
                🔍 Google Flights
              </a>
              <a
                href={`https://www.southwest.com/air/booking/select.html?originationAirportCode=${route.origin}&destinationAirportCode=${route.destination}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost text-xs flex-1 text-center"
              >
                ✈️ Southwest
              </a>
              <a
                href={`https://www.delta.com/flight-search/book-a-flight?cacheKeySuffix=a&tripType=ROUND_TRIP&departureDate=&returnDate=&originCity=${route.origin}&destinationCity=${route.destination}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost text-xs flex-1 text-center"
              >
                🔺 Delta
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Search Links */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">🔗 Quick Search (Mar 20-29)</h3>
          <div className="flex gap-3">
            <a
              href={`https://www.google.com/travel/flights?q=flights%20from%20ORD%20to%20KOA%20${DEPART_DATE}%20to%20${RETURN_DATE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost text-sm"
            >
              🌺 ORD → Kona
            </a>
            <a
              href={`https://www.google.com/travel/flights?q=flights%20from%20ORD%20to%20ITO%20${DEPART_DATE}%20to%20${RETURN_DATE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost text-sm"
            >
              🌴 ORD → Hilo
            </a>
          </div>
        </div>
      </div>

      {/* Price Chart */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Price History - {activeRoute.destinationName}</h3>
          <div className="flex items-center gap-4">
            <div className="text-sm text-[var(--muted)]">
              Lowest seen: <span className="text-[var(--success)]">${activeRoute.lowestPrice}</span>
            </div>
            <a
              href={activeRoute.searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary text-sm"
            >
              Search Flights →
            </a>
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">🔔 Price Alerts</h3>
          {showAlertSuccess && (
            <span className="text-green-400 text-sm">✓ Alert saved!</span>
          )}
        </div>

        {/* Active Alerts */}
        {alerts.filter(a => !a.triggered).length > 0 && (
          <div className="mb-4 space-y-2">
            <div className="text-sm text-[var(--muted)] mb-2">Active alerts:</div>
            {alerts.filter(a => !a.triggered).map((alert) => {
              const route = routes.find(r => r.id === alert.routeId);
              if (!route) return null;
              const isClose = route.currentPrice <= alert.targetPrice * 1.1;
              return (
                <div 
                  key={`${alert.routeId}-${alert.targetPrice}`}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isClose ? 'bg-yellow-500/20 border border-yellow-500/50' : 'bg-[var(--background)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🌺</span>
                    <div>
                      <span className="font-medium">{route.destinationName}</span>
                      <span className="text-[var(--muted)]"> below </span>
                      <span className="text-[var(--accent)] font-bold">${alert.targetPrice}</span>
                      {isClose && (
                        <span className="ml-2 text-yellow-400 text-sm">
                          (Currently ${route.currentPrice} - getting close!)
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    className="text-[var(--muted)] hover:text-red-400 text-sm"
                    onClick={() => removeAlert(alert.routeId)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Set New Alert */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm text-[var(--muted)] mb-1 block">
              Alert me when <span className="text-[var(--accent)]">{activeRoute.destinationName}</span> drops below:
            </label>
            <div className="flex gap-2">
              <span className="input w-12 text-center bg-[var(--border)]">$</span>
              <input
                type="number"
                className="input flex-1"
                placeholder={`e.g., ${Math.floor(activeRoute.currentPrice * 0.9)}`}
                value={alertPrice}
                onChange={(e) => setAlertPrice(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setAlert()}
              />
            </div>
          </div>
          <div className="flex items-end">
            <button className="btn btn-primary" onClick={setAlert}>
              Set Alert
            </button>
          </div>
        </div>
        
        {activeAlert && (
          <p className="text-sm text-[var(--success)] mt-3">
            ✓ You have an alert set for {activeRoute.destinationName} at ${activeAlert.targetPrice}
          </p>
        )}
        
        <p className="text-sm text-[var(--muted)] mt-3">
          Alerts are checked twice daily. You&apos;ll see a banner here when prices drop below your target.
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
              <li>• Consider flying into Kona (${routes[0].currentPrice}) and island-hopping to Hilo</li>
              <li>• Southwest bags fly free (2 checked bags included)</li>
              <li>• Use Google Flights price tracking for email alerts too</li>
            </ul>
          </div>
        </div>
      </div>

      </div>
  );
}
