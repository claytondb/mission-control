'use client';

import { useState, useEffect } from 'react';

type ItemType = 'task' | 'idea' | 'note' | 'reminder';

interface CaptureItem {
  id: string;
  type: ItemType;
  content: string;
  project?: string;
  completed?: boolean;
  createdAt: string;
  dueDate?: string;
}

const typeConfig = {
  task: { icon: '☐', label: 'Task', color: 'text-blue-400' },
  idea: { icon: '💡', label: 'Idea', color: 'text-yellow-400' },
  note: { icon: '📝', label: 'Note', color: 'text-gray-400' },
  reminder: { icon: '⏰', label: 'Reminder', color: 'text-purple-400' },
};

const STORAGE_KEY = 'mission-control-captures';

export default function QuickCapture() {
  const [items, setItems] = useState<CaptureItem[]>([]);
  const [input, setInput] = useState('');
  const [selectedType, setSelectedType] = useState<ItemType>('task');
  const [filter, setFilter] = useState<ItemType | 'all'>('all');
  const [showCompleted, setShowCompleted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      // Demo items
      setItems([
        {
          id: '1',
          type: 'task',
          content: 'Submit WooCommerce plugin to WordPress.org',
          project: 'Sails',
          completed: false,
          createdAt: '2026-02-22T09:00:00',
        },
        {
          id: '2',
          type: 'idea',
          content: 'Create a "Sales Tax Calculator" standalone tool for SEO traffic',
          project: 'Sails',
          completed: false,
          createdAt: '2026-02-22T08:30:00',
        },
        {
          id: '3',
          type: 'reminder',
          content: 'Check Hawaii flight prices on Tuesday (best deals)',
          completed: false,
          createdAt: '2026-02-22T08:00:00',
          dueDate: '2026-02-25',
        },
        {
          id: '4',
          type: 'note',
          content: 'IKEA case SOL: October 23, 2026',
          completed: false,
          createdAt: '2026-02-21T10:00:00',
        },
      ]);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  const addItem = () => {
    if (!input.trim()) return;
    
    const newItem: CaptureItem = {
      id: Date.now().toString(),
      type: selectedType,
      content: input.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    setItems([newItem, ...items]);
    setInput('');
  };

  const toggleComplete = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const filteredItems = items
    .filter(item => filter === 'all' || item.type === filter)
    .filter(item => showCompleted || !item.completed);

  const pendingCount = items.filter(i => !i.completed && i.type === 'task').length;
  const ideasCount = items.filter(i => i.type === 'idea').length;

  const exportToMarkdown = () => {
    const date = new Date().toISOString().split('T')[0];
    const md = `# Quick Capture Export - ${date}\n\n` +
      items.map(item => {
        const checkbox = item.type === 'task' ? (item.completed ? '- [x]' : '- [ ]') : '-';
        const icon = typeConfig[item.type].icon;
        return `${checkbox} ${icon} ${item.content}${item.project ? ` (${item.project})` : ''}`;
      }).join('\n');
    
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `capture-${date}.md`;
    a.click();
  };

  return (
    <div>
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-[var(--accent)]">{pendingCount}</div>
          <div className="text-sm text-[var(--muted)]">Pending Tasks</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-yellow-400">{ideasCount}</div>
          <div className="text-sm text-[var(--muted)]">Ideas Captured</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-[var(--success)]">
            {items.filter(i => i.completed).length}
          </div>
          <div className="text-sm text-[var(--muted)]">Completed</div>
        </div>
      </div>

      {/* Quick Input */}
      <div className="card mb-6">
        <div className="flex gap-2 mb-3">
          {(Object.entries(typeConfig) as [ItemType, typeof typeConfig.task][]).map(([type, config]) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`btn ${selectedType === type ? 'btn-primary' : 'btn-ghost'} text-sm`}
            >
              {config.icon} {config.label}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            className="input flex-1"
            placeholder={`Capture a ${selectedType}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
          />
          <button className="btn btn-primary" onClick={addItem}>
            Add
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-ghost'} text-sm`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          {(Object.entries(typeConfig) as [ItemType, typeof typeConfig.task][]).map(([type, config]) => (
            <button
              key={type}
              className={`btn ${filter === type ? 'btn-primary' : 'btn-ghost'} text-sm`}
              onClick={() => setFilter(type)}
            >
              {config.icon}
            </button>
          ))}
        </div>
        <div className="flex gap-3 items-center">
          <label className="flex items-center gap-2 text-sm text-[var(--muted)] cursor-pointer">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="rounded"
            />
            Show completed
          </label>
          <button className="btn btn-ghost text-sm" onClick={exportToMarkdown}>
            Export .md
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`card flex items-start gap-3 p-4 ${
              item.completed ? 'opacity-50' : ''
            }`}
          >
            {item.type === 'task' ? (
              <button
                onClick={() => toggleComplete(item.id)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                  item.completed
                    ? 'bg-[var(--success)] border-[var(--success)]'
                    : 'border-[var(--border)] hover:border-[var(--accent)]'
                }`}
              >
                {item.completed && <span className="text-white text-xs">✓</span>}
              </button>
            ) : (
              <span className={`mt-0.5 ${typeConfig[item.type].color}`}>
                {typeConfig[item.type].icon}
              </span>
            )}
            <div className="flex-1">
              <div className={item.completed ? 'line-through' : ''}>
                {item.content}
              </div>
              <div className="flex gap-3 mt-1 text-xs text-[var(--muted)]">
                {item.project && (
                  <span className="bg-[var(--border)] px-2 py-0.5 rounded">
                    {item.project}
                  </span>
                )}
                <span>
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                {item.dueDate && (
                  <span className="text-[var(--warning)]">
                    Due: {item.dueDate}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => deleteItem(item.id)}
              className="text-[var(--muted)] hover:text-[var(--danger)] transition-colors"
            >
              ✕
            </button>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-[var(--muted)]">
            No items to show. Start capturing!
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts */}
      <div className="mt-6 p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
        <div className="flex items-start gap-3">
          <span className="text-xl">⌨️</span>
          <div className="text-sm text-[var(--muted)]">
            <span className="font-medium text-[var(--foreground)]">Quick tip:</span> Press Enter to quickly add items. Use the type buttons to switch between tasks, ideas, notes, and reminders.
          </div>
        </div>
      </div>
    </div>
  );
}
