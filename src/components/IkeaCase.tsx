'use client';

import { useState, useEffect } from 'react';

type AttorneyStatus = 'contacted' | 'pending' | 'declined' | 'interested' | 'hired';

interface Attorney {
  id: string;
  name: string;
  firm: string;
  phone?: string;
  email?: string;
  website?: string;
  status: AttorneyStatus;
  notes: string;
  dateContacted?: string;
  specialty?: string;
}

interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  dueDate?: string;
  notes?: string;
}

interface CaseFile {
  id: string;
  name: string;
  type: 'document' | 'photo' | 'video' | 'report' | 'correspondence';
  url?: string;
  localPath?: string;
  description?: string;
  dateAdded: string;
}

interface CaseData {
  attorneys: Attorney[];
  checklist: ChecklistItem[];
  files: CaseFile[];
  notes: string;
}

const STORAGE_KEY = 'mission-control-ikea-case';

const SOL_DATE = new Date('2026-10-23T23:59:59');

const defaultAttorneys: Attorney[] = [
  {
    id: '1',
    name: 'Meyers & Flowers',
    firm: 'Meyers & Flowers',
    website: 'https://www.meyersandflowers.com',
    phone: '(630) 369-3335',
    status: 'declined',
    notes: 'Declined representation - Feb 2026',
    dateContacted: '2026-02-01',
    specialty: 'Product Liability, Personal Injury',
  },
  {
    id: '2',
    name: 'Robins Kaplan',
    firm: 'Robins Kaplan LLP',
    website: 'https://www.robinskaplan.com',
    phone: '(612) 349-8500',
    status: 'pending',
    notes: 'Intake form drafted, need to submit',
    specialty: 'Product Liability, Mass Torts',
  },
  {
    id: '3',
    name: 'The Lyon Firm',
    firm: 'The Lyon Firm',
    website: 'https://www.thelyonfirm.com',
    phone: '(513) 381-2333',
    status: 'pending',
    notes: 'Specializes in defective product cases',
    specialty: 'Product Liability',
  },
  {
    id: '4',
    name: 'Simmons Hanly Conroy',
    firm: 'Simmons Hanly Conroy',
    website: 'https://www.simmonsfirm.com',
    phone: '(618) 259-2222',
    status: 'pending',
    notes: 'Large firm with product liability practice',
    specialty: 'Product Liability, Mass Torts',
  },
  {
    id: '5',
    name: 'Clifford Law Offices',
    firm: 'Clifford Law Offices',
    website: 'https://www.cliffordlaw.com',
    phone: '(312) 899-9090',
    status: 'pending',
    notes: 'Chicago-based, strong product liability track record',
    specialty: 'Product Liability, Personal Injury',
  },
];

const defaultChecklist: ChecklistItem[] = [
  {
    id: '1',
    task: 'Send attorney intake forms to remaining firms',
    completed: false,
    notes: 'Robins Kaplan, The Lyon Firm, others',
  },
  {
    id: '2',
    task: 'Request Agosti Fire Investigation report from Sumi Lee',
    completed: false,
    notes: 'Letter drafted - need to send',
  },
  {
    id: '3',
    task: 'File IL Attorney General complaint',
    completed: false,
    notes: 'Draft ready',
  },
  {
    id: '4',
    task: 'File IL Department of Insurance complaint',
    completed: false,
    notes: 'Draft ready',
  },
  {
    id: '5',
    task: 'Gather all medical/therapy receipts',
    completed: false,
    notes: 'All family members in therapy - document costs',
  },
  {
    id: '6',
    task: 'Document all out-of-pocket expenses',
    completed: false,
    notes: 'Target: ~$20K documented',
  },
  {
    id: '7',
    task: 'Collect Amazon 1-star reviews showing pattern',
    completed: true,
    notes: 'Multiple reviews cite "loose wiring", "cheap wiring", flickering',
  },
  {
    id: '8',
    task: 'Document 2016 GOTHEM lamp recall',
    completed: true,
    notes: 'Proves IKEA knew about wiring vulnerability',
  },
  {
    id: '9',
    task: 'CPSC report filed',
    completed: true,
    notes: 'Report published',
  },
];

const defaultFiles: CaseFile[] = [
  {
    id: '1',
    name: 'Fire Department Report',
    type: 'report',
    description: 'Confirmed origin at lamp location, cannot rule out electrical',
    dateAdded: '2024-10-24',
  },
  {
    id: '2',
    name: 'Agosti Fire Investigation Report',
    type: 'report',
    description: 'State Farm investigator - cord damaged by rocking chair → arcing → fire',
    dateAdded: '2025-01-15',
  },
  {
    id: '3',
    name: 'Helmsman Denial Letter',
    type: 'correspondence',
    description: 'IKEA insurer denied claim 10/6/2025',
    dateAdded: '2025-10-06',
  },
  {
    id: '4',
    name: 'CPSC Report',
    type: 'report',
    description: 'Consumer Product Safety Commission report - published',
    dateAdded: '2025-06-01',
  },
  {
    id: '5',
    name: 'Attorney Intake Draft',
    type: 'document',
    localPath: '/root/clawd/ikea-case/',
    description: 'Ready to send to firms',
    dateAdded: '2026-02-01',
  },
  {
    id: '6',
    name: 'Sumi Lee Letter Draft',
    type: 'correspondence',
    localPath: '/root/clawd/ikea-case/',
    description: 'Request for Agosti report',
    dateAdded: '2026-02-01',
  },
];

const statusConfig = {
  contacted: { label: 'Contacted', class: 'bg-blue-500/20 text-blue-400' },
  pending: { label: 'To Contact', class: 'bg-yellow-500/20 text-yellow-400' },
  declined: { label: 'Declined', class: 'bg-red-500/20 text-red-400' },
  interested: { label: 'Interested', class: 'bg-green-500/20 text-green-400' },
  hired: { label: 'Hired', class: 'bg-purple-500/20 text-purple-400' },
};

const fileTypeConfig = {
  document: { emoji: '📄', label: 'Document' },
  photo: { emoji: '📷', label: 'Photo' },
  video: { emoji: '🎥', label: 'Video' },
  report: { emoji: '📋', label: 'Report' },
  correspondence: { emoji: '✉️', label: 'Correspondence' },
};

export default function IkeaCase() {
  const [data, setData] = useState<CaseData>({
    attorneys: defaultAttorneys,
    checklist: defaultChecklist,
    files: defaultFiles,
    notes: '',
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'attorneys' | 'checklist' | 'files'>('overview');
  const [showAddAttorney, setShowAddAttorney] = useState(false);
  const [showAddFile, setShowAddFile] = useState(false);
  const [newAttorney, setNewAttorney] = useState({ name: '', firm: '', phone: '', email: '', website: '', specialty: '' });
  const [newFile, setNewFile] = useState({ name: '', type: 'document' as CaseFile['type'], url: '', description: '' });
  const [newTask, setNewTask] = useState('');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Calculate countdown
  const now = new Date();
  const timeLeft = SOL_DATE.getTime() - now.getTime();
  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const monthsLeft = Math.floor(daysLeft / 30);

  const updateAttorneyStatus = (id: string, status: AttorneyStatus) => {
    setData({
      ...data,
      attorneys: data.attorneys.map(a => a.id === id ? { ...a, status } : a),
    });
  };

  const updateAttorneyNotes = (id: string, notes: string) => {
    setData({
      ...data,
      attorneys: data.attorneys.map(a => a.id === id ? { ...a, notes } : a),
    });
  };

  const toggleChecklist = (id: string) => {
    setData({
      ...data,
      checklist: data.checklist.map(c => c.id === id ? { ...c, completed: !c.completed } : c),
    });
  };

  const addAttorney = () => {
    if (!newAttorney.name.trim()) return;
    const attorney: Attorney = {
      id: Date.now().toString(),
      ...newAttorney,
      status: 'pending',
      notes: '',
    };
    setData({ ...data, attorneys: [...data.attorneys, attorney] });
    setNewAttorney({ name: '', firm: '', phone: '', email: '', website: '', specialty: '' });
    setShowAddAttorney(false);
  };

  const addFile = () => {
    if (!newFile.name.trim()) return;
    const file: CaseFile = {
      id: Date.now().toString(),
      ...newFile,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setData({ ...data, files: [...data.files, file] });
    setNewFile({ name: '', type: 'document', url: '', description: '' });
    setShowAddFile(false);
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: ChecklistItem = {
      id: Date.now().toString(),
      task: newTask,
      completed: false,
    };
    setData({ ...data, checklist: [...data.checklist, task] });
    setNewTask('');
  };

  const completedTasks = data.checklist.filter(c => c.completed).length;
  const pendingAttorneys = data.attorneys.filter(a => a.status === 'pending').length;
  const contactedAttorneys = data.attorneys.filter(a => a.status === 'contacted' || a.status === 'interested').length;

  return (
    <div>
      {/* SOL Countdown Banner */}
      <div className={`card mb-6 ${daysLeft < 90 ? 'border-red-500 bg-red-500/10' : daysLeft < 180 ? 'border-yellow-500 bg-yellow-500/10' : ''}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              ⚖️ IKEA Product Liability Case
            </h2>
            <p className="text-[var(--muted)] text-sm mt-1">
              LAUTERS Floor Lamp Fire - October 23, 2024
            </p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${daysLeft < 90 ? 'text-red-400' : daysLeft < 180 ? 'text-yellow-400' : 'text-[var(--accent)]'}`}>
              {daysLeft} days
            </div>
            <div className="text-sm text-[var(--muted)]">
              until SOL ({monthsLeft} months) - Oct 23, 2026
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-[var(--accent)]">{pendingAttorneys}</div>
          <div className="text-sm text-[var(--muted)]">To Contact</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-400">{contactedAttorneys}</div>
          <div className="text-sm text-[var(--muted)]">Contacted</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-[var(--success)]">{completedTasks}</div>
          <div className="text-sm text-[var(--muted)]">Tasks Done</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold">{data.files.length}</div>
          <div className="text-sm text-[var(--muted)]">Files</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['overview', 'attorneys', 'checklist', 'files'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-ghost'}`}
          >
            {tab === 'overview' && '📊 Overview'}
            {tab === 'attorneys' && '👔 Attorneys'}
            {tab === 'checklist' && '✅ Checklist'}
            {tab === 'files' && '📁 Files'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Case Summary */}
          <div className="card">
            <h3 className="font-semibold mb-4 text-lg">📋 Case Summary</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-[var(--accent)] mb-2">Core Facts</h4>
                <ul className="space-y-2 text-sm text-[var(--muted)]">
                  <li>• LAUTERS floor lamp caught fire at 4:30am in 3yo daughter&apos;s room</li>
                  <li>• Family of 5 evacuated safely</li>
                  <li>• 10-month displacement from home</li>
                  <li>• ~$20K out-of-pocket damages</li>
                  <li>• All family members now in therapy/on medication</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-[var(--accent)] mb-2">Legal Strategy</h4>
                <ul className="space-y-2 text-sm text-[var(--muted)]">
                  <li>• <strong>DESIGN DEFECT case</strong> - cord fails from normal furniture contact</li>
                  <li>• Foreseeable use doctrine: lamp cords near furniture is normal</li>
                  <li>• 2016 GOTHEM recall proves IKEA knew about wiring issues</li>
                  <li>• Pattern: Multiple 1-star reviews cite &quot;loose wiring&quot;, flickering</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Key Contacts */}
          <div className="card">
            <h3 className="font-semibold mb-4 text-lg">📞 Key Contacts</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-[var(--background)] rounded-lg">
                <div className="font-medium">IKEA&apos;s Insurer (Helmsman/Liberty Mutual)</div>
                <div className="text-[var(--accent)]">Sumi Lee</div>
                <div className="text-sm text-[var(--muted)] mt-1">
                  📞 (469) 997-5560<br />
                  ✉️ sumi.lee@libertymutual.com
                </div>
                <div className="text-xs text-[var(--muted)] mt-2">
                  Claim #: P 413-319747-01
                </div>
              </div>
              <div className="p-4 bg-[var(--background)] rounded-lg">
                <div className="font-medium">State Farm (Your Insurance)</div>
                <div className="text-[var(--muted)]">Beth Quick</div>
                <div className="text-sm text-[var(--muted)] mt-1">
                  Status: Declined subrogation<br />
                  Reason: Blames rocking chair
                </div>
              </div>
            </div>
          </div>

          {/* Investigation Findings */}
          <div className="card">
            <h3 className="font-semibold mb-4 text-lg">🔍 Investigation Findings</h3>
            <div className="p-4 bg-[var(--background)] rounded-lg">
              <div className="font-medium text-[var(--warning)]">Agosti Fire Investigations (State Farm)</div>
              <p className="text-sm text-[var(--muted)] mt-2">
                Finding: Cord damaged by rocking chair → arcing → fire
              </p>
              <p className="text-sm text-[var(--success)] mt-2">
                <strong>This SUPPORTS our case:</strong> Cord that fails from furniture contact = DESIGN DEFECT
              </p>
              <p className="text-sm text-[var(--muted)] mt-2">
                Fire dept confirmed origin at lamp location, cannot rule out electrical cause.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Attorneys Tab */}
      {activeTab === 'attorneys' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Attorney Contacts</h3>
            <button className="btn btn-primary" onClick={() => setShowAddAttorney(!showAddAttorney)}>
              + Add Attorney
            </button>
          </div>

          {showAddAttorney && (
            <div className="card mb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  className="input"
                  placeholder="Attorney/Firm Name"
                  value={newAttorney.name}
                  onChange={(e) => setNewAttorney({ ...newAttorney, name: e.target.value })}
                />
                <input
                  type="text"
                  className="input"
                  placeholder="Firm"
                  value={newAttorney.firm}
                  onChange={(e) => setNewAttorney({ ...newAttorney, firm: e.target.value })}
                />
                <input
                  type="text"
                  className="input"
                  placeholder="Phone"
                  value={newAttorney.phone}
                  onChange={(e) => setNewAttorney({ ...newAttorney, phone: e.target.value })}
                />
                <input
                  type="text"
                  className="input"
                  placeholder="Email"
                  value={newAttorney.email}
                  onChange={(e) => setNewAttorney({ ...newAttorney, email: e.target.value })}
                />
                <input
                  type="text"
                  className="input"
                  placeholder="Website"
                  value={newAttorney.website}
                  onChange={(e) => setNewAttorney({ ...newAttorney, website: e.target.value })}
                />
                <input
                  type="text"
                  className="input"
                  placeholder="Specialty"
                  value={newAttorney.specialty}
                  onChange={(e) => setNewAttorney({ ...newAttorney, specialty: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <button className="btn btn-primary" onClick={addAttorney}>Add</button>
                <button className="btn btn-ghost" onClick={() => setShowAddAttorney(false)}>Cancel</button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {data.attorneys.map((attorney) => (
              <div key={attorney.id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-medium text-lg">{attorney.name}</div>
                    {attorney.firm !== attorney.name && (
                      <div className="text-sm text-[var(--muted)]">{attorney.firm}</div>
                    )}
                    {attorney.specialty && (
                      <div className="text-xs text-[var(--accent)]">{attorney.specialty}</div>
                    )}
                  </div>
                  <select
                    className={`badge ${statusConfig[attorney.status].class} border-none cursor-pointer`}
                    value={attorney.status}
                    onChange={(e) => updateAttorneyStatus(attorney.id, e.target.value as AttorneyStatus)}
                  >
                    <option value="pending">To Contact</option>
                    <option value="contacted">Contacted</option>
                    <option value="interested">Interested</option>
                    <option value="declined">Declined</option>
                    <option value="hired">Hired</option>
                  </select>
                </div>
                <div className="flex gap-4 text-sm text-[var(--muted)] mb-3">
                  {attorney.phone && <span>📞 {attorney.phone}</span>}
                  {attorney.email && <span>✉️ {attorney.email}</span>}
                  {attorney.website && (
                    <a href={attorney.website} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">
                      🔗 Website
                    </a>
                  )}
                </div>
                <div>
                  <textarea
                    className="input text-sm w-full"
                    rows={2}
                    placeholder="Notes..."
                    value={attorney.notes}
                    onChange={(e) => updateAttorneyNotes(attorney.id, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checklist Tab */}
      {activeTab === 'checklist' && (
        <div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              className="input flex-1"
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <button className="btn btn-primary" onClick={addTask}>Add</button>
          </div>

          <div className="space-y-2">
            {data.checklist.map((item) => (
              <div
                key={item.id}
                className={`card flex items-start gap-3 p-4 ${item.completed ? 'opacity-60' : ''}`}
              >
                <button
                  onClick={() => toggleChecklist(item.id)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                    item.completed
                      ? 'bg-[var(--success)] border-[var(--success)]'
                      : 'border-[var(--border)] hover:border-[var(--accent)]'
                  }`}
                >
                  {item.completed && <span className="text-white text-xs">✓</span>}
                </button>
                <div className="flex-1">
                  <div className={item.completed ? 'line-through' : ''}>{item.task}</div>
                  {item.notes && (
                    <div className="text-sm text-[var(--muted)] mt-1">{item.notes}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm text-[var(--muted)]">
            {completedTasks} of {data.checklist.length} tasks completed
          </div>
        </div>
      )}

      {/* Files Tab */}
      {activeTab === 'files' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Case Files & Documents</h3>
            <button className="btn btn-primary" onClick={() => setShowAddFile(!showAddFile)}>
              + Add File
            </button>
          </div>

          {showAddFile && (
            <div className="card mb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  className="input"
                  placeholder="File Name"
                  value={newFile.name}
                  onChange={(e) => setNewFile({ ...newFile, name: e.target.value })}
                />
                <select
                  className="input"
                  value={newFile.type}
                  onChange={(e) => setNewFile({ ...newFile, type: e.target.value as CaseFile['type'] })}
                >
                  <option value="document">📄 Document</option>
                  <option value="report">📋 Report</option>
                  <option value="correspondence">✉️ Correspondence</option>
                  <option value="photo">📷 Photo</option>
                  <option value="video">🎥 Video</option>
                </select>
                <input
                  type="text"
                  className="input col-span-2"
                  placeholder="URL or file path"
                  value={newFile.url}
                  onChange={(e) => setNewFile({ ...newFile, url: e.target.value })}
                />
                <input
                  type="text"
                  className="input col-span-2"
                  placeholder="Description"
                  value={newFile.description}
                  onChange={(e) => setNewFile({ ...newFile, description: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <button className="btn btn-primary" onClick={addFile}>Add</button>
                <button className="btn btn-ghost" onClick={() => setShowAddFile(false)}>Cancel</button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {data.files.map((file) => (
              <div key={file.id} className="card flex items-center gap-4 p-4">
                <span className="text-2xl">{fileTypeConfig[file.type].emoji}</span>
                <div className="flex-1">
                  <div className="font-medium">{file.name}</div>
                  {file.description && (
                    <div className="text-sm text-[var(--muted)]">{file.description}</div>
                  )}
                  <div className="text-xs text-[var(--muted)] mt-1">
                    Added: {file.dateAdded}
                    {file.localPath && <span className="ml-2">📁 {file.localPath}</span>}
                  </div>
                </div>
                {file.url && (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost text-sm"
                  >
                    Open
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
