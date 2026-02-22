'use client';

import { useState } from 'react';

type Status = 'live' | 'building' | 'idea' | 'paused';
type Priority = 'high' | 'medium' | 'low';

interface Project {
  id: string;
  name: string;
  status: Status;
  priority: Priority;
  revenue: string;
  url?: string;
  repo?: string;
  nextAction?: string;
  lastUpdated?: string;
}

// Sample data - this would eventually come from an API or local storage
const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Sails',
    status: 'live',
    priority: 'high',
    revenue: '$0/mo',
    url: 'https://sails.tax',
    repo: 'salestaxjar',
    nextAction: 'WordPress plugin submission',
    lastUpdated: '2026-02-22',
  },
  {
    id: '2',
    name: 'Threetris',
    status: 'building',
    priority: 'medium',
    revenue: '-',
    repo: 'threetris',
    nextAction: 'App Store submission',
    lastUpdated: '2026-02-21',
  },
  {
    id: '3',
    name: 'Lydix',
    status: 'live',
    priority: 'low',
    revenue: '$0/mo',
    url: 'https://lydix.app',
    lastUpdated: '2026-01-15',
  },
  {
    id: '4',
    name: 'MagicLamp',
    status: 'live',
    priority: 'low',
    revenue: '$0/mo',
    lastUpdated: '2025-12-01',
  },
  {
    id: '5',
    name: 'Forever Snow',
    status: 'live',
    priority: 'low',
    revenue: '$0/mo',
    lastUpdated: '2025-11-15',
  },
  {
    id: '6',
    name: 'Jumpy Friend',
    status: 'live',
    priority: 'low',
    revenue: '$0/mo',
    lastUpdated: '2025-10-01',
  },
  {
    id: '7',
    name: '3D Retopology',
    status: 'building',
    priority: 'medium',
    revenue: '-',
    nextAction: 'Core algorithm',
    lastUpdated: '2026-02-10',
  },
  {
    id: '8',
    name: 'Anywhere2Splat',
    status: 'idea',
    priority: 'medium',
    revenue: '-',
    nextAction: 'Research Gaussian splatting',
  },
  {
    id: '9',
    name: 'BikeVR',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '10',
    name: 'Big Island VR',
    status: 'building',
    priority: 'medium',
    revenue: '-',
    repo: 'bigislandvr-quest',
    lastUpdated: '2026-02-21',
  },
];

const statusConfig = {
  live: { label: 'Live', class: 'badge-success' },
  building: { label: 'Building', class: 'badge-warning' },
  idea: { label: 'Idea', class: 'badge-muted' },
  paused: { label: 'Paused', class: 'badge-danger' },
};

const priorityConfig = {
  high: { label: 'High', class: 'text-red-400' },
  medium: { label: 'Med', class: 'text-yellow-400' },
  low: { label: 'Low', class: 'text-gray-500' },
};

export default function ProjectTracker() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', status: 'idea' as Status, priority: 'medium' as Priority });

  const filteredProjects = projects
    .filter(p => filter === 'all' || p.status === filter)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    live: projects.filter(p => p.status === 'live').length,
    building: projects.filter(p => p.status === 'building').length,
    ideas: projects.filter(p => p.status === 'idea').length,
    total: projects.length,
  };

  const addProject = () => {
    if (!newProject.name.trim()) return;
    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      status: newProject.status,
      priority: newProject.priority,
      revenue: '-',
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setProjects([project, ...projects]);
    setNewProject({ name: '', status: 'idea', priority: 'medium' });
    setShowAddForm(false);
  };

  const updateStatus = (id: string, status: Status) => {
    setProjects(projects.map(p => 
      p.id === id ? { ...p, status, lastUpdated: new Date().toISOString().split('T')[0] } : p
    ));
  };

  return (
    <div>
      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-[var(--success)]">{stats.live}</div>
          <div className="text-sm text-[var(--muted)]">Live</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-[var(--warning)]">{stats.building}</div>
          <div className="text-sm text-[var(--muted)]">Building</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-[var(--muted)]">{stats.ideas}</div>
          <div className="text-sm text-[var(--muted)]">Ideas</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold">{stats.total}</div>
          <div className="text-sm text-[var(--muted)]">Total</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search projects..."
          className="input flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input w-40"
          value={filter}
          onChange={(e) => setFilter(e.target.value as Status | 'all')}
        >
          <option value="all">All Status</option>
          <option value="live">Live</option>
          <option value="building">Building</option>
          <option value="idea">Idea</option>
          <option value="paused">Paused</option>
        </select>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          + Add Project
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="card mb-6 flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm text-[var(--muted)] mb-1 block">Project Name</label>
            <input
              type="text"
              className="input"
              placeholder="New project name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && addProject()}
            />
          </div>
          <div>
            <label className="text-sm text-[var(--muted)] mb-1 block">Status</label>
            <select
              className="input"
              value={newProject.status}
              onChange={(e) => setNewProject({ ...newProject, status: e.target.value as Status })}
            >
              <option value="idea">Idea</option>
              <option value="building">Building</option>
              <option value="live">Live</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-[var(--muted)] mb-1 block">Priority</label>
            <select
              className="input"
              value={newProject.priority}
              onChange={(e) => setNewProject({ ...newProject, priority: e.target.value as Priority })}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={addProject}>Add</button>
          <button className="btn btn-ghost" onClick={() => setShowAddForm(false)}>Cancel</button>
        </div>
      )}

      {/* Projects Table */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-sm text-[var(--muted)]">
              <th className="p-4">Project</th>
              <th className="p-4">Status</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Revenue</th>
              <th className="p-4">Next Action</th>
              <th className="p-4">Updated</th>
              <th className="p-4">Links</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr 
                key={project.id} 
                className="border-b border-[var(--border)] hover:bg-[var(--card-hover)] transition-colors"
              >
                <td className="p-4 font-medium">{project.name}</td>
                <td className="p-4">
                  <select
                    className={`badge ${statusConfig[project.status].class} bg-transparent border-none cursor-pointer`}
                    value={project.status}
                    onChange={(e) => updateStatus(project.id, e.target.value as Status)}
                  >
                    <option value="live">Live</option>
                    <option value="building">Building</option>
                    <option value="idea">Idea</option>
                    <option value="paused">Paused</option>
                  </select>
                </td>
                <td className={`p-4 text-sm ${priorityConfig[project.priority].class}`}>
                  {priorityConfig[project.priority].label}
                </td>
                <td className="p-4 text-sm">{project.revenue}</td>
                <td className="p-4 text-sm text-[var(--muted)]">
                  {project.nextAction || '-'}
                </td>
                <td className="p-4 text-sm text-[var(--muted)]">
                  {project.lastUpdated || '-'}
                </td>
                <td className="p-4 flex gap-2">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent)] hover:underline text-sm"
                    >
                      Site
                    </a>
                  )}
                  {project.repo && (
                    <a
                      href={`https://github.com/claytondb/${project.repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--muted)] hover:text-[var(--accent)] text-sm"
                    >
                      GitHub
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProjects.length === 0 && (
          <div className="p-8 text-center text-[var(--muted)]">
            No projects found
          </div>
        )}
      </div>
    </div>
  );
}
