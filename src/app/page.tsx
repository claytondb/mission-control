'use client';

import { useState } from 'react';
import ProjectTracker from '@/components/ProjectTracker';
import FlightMonitor from '@/components/FlightMonitor';
import QuickCapture from '@/components/QuickCapture';
import IkeaCase from '@/components/IkeaCase';

type Tool = 'projects' | 'flights' | 'capture' | 'ikea';

export default function Home() {
  const [activeTool, setActiveTool] = useState<Tool>('projects');

  const tools = [
    { id: 'projects' as Tool, name: 'Projects', icon: '📦', desc: 'Track all projects' },
    { id: 'flights' as Tool, name: 'Hawaii Flights', icon: '🌺', desc: 'Price monitor' },
    { id: 'capture' as Tool, name: 'Quick Capture', icon: '⚡', desc: 'Notes & tasks' },
    { id: 'ikea' as Tool, name: 'IKEA Case', icon: '⚖️', desc: 'Lawsuit tracker' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border)] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚀</span>
            <h1 className="text-xl font-bold">Mission Control</h1>
          </div>
          <div className="text-sm text-[var(--muted)]">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Tool Tabs */}
        <div className="flex gap-3 mb-6">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                activeTool === tool.id
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)]'
              }`}
            >
              <span className="text-lg">{tool.icon}</span>
              <div className="text-left">
                <div className="font-medium">{tool.name}</div>
                <div className={`text-xs ${activeTool === tool.id ? 'text-blue-200' : 'text-[var(--muted)]'}`}>
                  {tool.desc}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Active Tool */}
        <div className="mt-6">
          {activeTool === 'projects' && <ProjectTracker />}
          {activeTool === 'flights' && <FlightMonitor />}
          {activeTool === 'capture' && <QuickCapture />}
          {activeTool === 'ikea' && <IkeaCase />}
        </div>
      </div>
    </div>
  );
}
