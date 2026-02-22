'use client';

import { useState, useEffect } from 'react';

type Status = 'live' | 'building' | 'idea' | 'paused';
type Priority = 'high' | 'medium' | 'low';
type ProjectType = 'app' | 'game' | 'website';

interface Project {
  id: string;
  name: string;
  type: ProjectType;
  description: string;
  status: Status;
  priority: Priority;
  revenue: string;
  url?: string;
  localPath?: string;
  nextAction?: string;
  lastUpdated?: string;
}

const STORAGE_KEY = 'mission-control-projects';

// Full project list from spreadsheet
const defaultProjects: Project[] = [
  // HIGH PRIORITY - Active/Revenue potential
  {
    id: '1',
    name: 'Sails.tax',
    type: 'website',
    description: 'Automatically keeps businesses up to date with sales tax they owe in all US states',
    status: 'live',
    priority: 'high',
    revenue: '$0/mo',
    url: 'https://sails.tax',
    localPath: 'dc-salestaxjar',
  },
  {
    id: '2',
    name: 'Threetris',
    type: 'game',
    description: 'Tetris + Bejeweled mobile puzzle game',
    status: 'building',
    priority: 'high',
    revenue: '-',
    localPath: 'dc-threetris',
    nextAction: 'App Store submission',
  },
  {
    id: '3',
    name: 'MagicLamp',
    type: 'app',
    description: 'Bitcoin wallet generator and address cracker, subscriptions offered',
    status: 'live',
    priority: 'medium',
    revenue: '$0/mo',
    url: 'https://magiclamp.replit.app',
    localPath: 'dc-magiclamp',
  },
  {
    id: '4',
    name: 'Convert FLI to MP4',
    type: 'website',
    description: 'Converts obsolete video format to MP4. $3 each',
    status: 'live',
    priority: 'medium',
    revenue: '$0/mo',
    url: 'https://fli2mp4.com',
  },
  {
    id: '5',
    name: 'Convert Wordperfect to Word',
    type: 'website',
    description: 'Converts wordperfect files to Word. $5 each',
    status: 'live',
    priority: 'medium',
    revenue: '$0/mo',
    url: 'https://convert-wordperfect.xyz',
  },
  {
    id: '6',
    name: 'Kalshi Market Maker Bot',
    type: 'app',
    description: 'Created arbitrage app with Claude Code',
    status: 'live',
    priority: 'medium',
    revenue: '-',
    localPath: 'dc-kalshimarketmaker',
  },

  // LIVE PROJECTS
  {
    id: '7',
    name: 'Lydix.app',
    type: 'app',
    description: 'AI tool that evaluates your song and makes suggestions to make it better.',
    status: 'live',
    priority: 'low',
    revenue: '$0/mo',
    url: 'https://lydix.app',
    localPath: 'dc-lydix',
  },
  {
    id: '8',
    name: 'Jumpy Friend',
    type: 'game',
    description: 'Game - NSTower clone',
    status: 'live',
    priority: 'low',
    revenue: '$0/mo',
    url: 'https://jumpyfriend.replit.app',
    localPath: 'dc-jumpy-friend',
  },
  {
    id: '9',
    name: 'Forever Snow',
    type: 'game',
    description: 'Game - Infinite snowboarding with random terrain',
    status: 'live',
    priority: 'low',
    revenue: '$0/mo',
    url: 'https://foreversnow.replit.app',
    localPath: 'dc-snowboardgame',
  },
  {
    id: '10',
    name: 'Kaladdin',
    type: 'app',
    description: 'Ask your calendar questions, integrates with all your calendars.',
    status: 'live',
    priority: 'low',
    revenue: '$0/mo',
    url: 'https://kaladdin.replit.app',
  },
  {
    id: '11',
    name: 'LOA Tool',
    type: 'app',
    description: 'Clone of the Secret app for iOS, but in browser',
    status: 'live',
    priority: 'low',
    revenue: '$0/mo',
    url: 'https://wealthyvibe.replit.app',
  },
  {
    id: '12',
    name: 'WhiteScreen',
    type: 'app',
    description: 'White or any other color for your full screen',
    status: 'live',
    priority: 'low',
    revenue: '$0/mo',
    url: 'https://whitescreen.replit.app',
  },
  {
    id: '13',
    name: 'FinishMyBookAI',
    type: 'app',
    description: 'Upload an unfinished book, let AI read it and finish it',
    status: 'live',
    priority: 'low',
    revenue: '$0/mo',
    url: 'https://claytondb.github.io/finishmybookai/',
    localPath: 'dc-finishmybookai',
  },
  {
    id: '14',
    name: 'FloraChroma',
    type: 'app',
    description: 'Flower color theme assistant. Helps learn color theory and make arrangements.',
    status: 'building',
    priority: 'low',
    revenue: '-',
    url: 'https://claytondb.github.io/florachroma/',
    localPath: 'dc-florachroma',
  },
  {
    id: '15',
    name: 'GoodTimer',
    type: 'app',
    description: 'Digital good timer for kids, keep track of rewards and earned time',
    status: 'live',
    priority: 'low',
    revenue: '$0/mo',
    url: 'https://claytondb.github.io/goodtimer/',
    localPath: 'dc-goodtimer',
  },
  {
    id: '16',
    name: 'MistakeIfy',
    type: 'app',
    description: 'Turn ai-generated text into one with grammatical or spelling errors, to make it more human.',
    status: 'live',
    priority: 'low',
    revenue: '$0/mo',
    url: 'https://claytondb.github.io/mistakelfy/',
    localPath: 'dc-mistakelfy',
  },
  {
    id: '17',
    name: 'QR Gen',
    type: 'app',
    description: 'Fast QR code generator for URLs, WiFi, email, phone, SMS. Customizable colors and sizes.',
    status: 'live',
    priority: 'low',
    revenue: '$0/mo',
    url: 'https://claytondb.github.io/qrgen/',
    localPath: 'dc-qrgen',
  },
  {
    id: '18',
    name: 'RandomFart',
    type: 'app',
    description: 'Play a fart noise at a random time, intermittently. Also cough, sneeze, say a random word.',
    status: 'live',
    priority: 'low',
    revenue: '$0/mo',
    url: 'https://claytondb.github.io/randomfart/',
    localPath: 'dc-randomfart',
  },
  {
    id: '19',
    name: 'SoundBuddy',
    type: 'app',
    description: 'Soundboard app for mobile, large easy buttons programmable',
    status: 'building',
    priority: 'low',
    revenue: '-',
    url: 'https://claytondb.github.io/soundbuddy/',
    localPath: 'dc-soundbuddy',
  },
  {
    id: '20',
    name: 'Time Travel Message',
    type: 'app',
    description: 'Create spacetime receiver that can get messages from the future, and send messages back to the past',
    status: 'building',
    priority: 'low',
    revenue: '-',
    url: 'https://claytondb.github.io/timetravelmessage/',
    localPath: 'dc-timetravelmessage',
  },
  {
    id: '21',
    name: 'Cubicle Cat',
    type: 'game',
    description: 'Cat that just sits on your desk monitor and does stuff at random times while you\'re working.',
    status: 'building',
    priority: 'low',
    revenue: '-',
    url: 'https://claytondb.github.io/cubiclecat/',
    localPath: 'dc-cubiclecat',
  },
  {
    id: '22',
    name: 'Apple Warranty Check',
    type: 'website',
    description: 'Serial look up for apple product warranty',
    status: 'live',
    priority: 'low',
    revenue: '$0/mo',
    url: 'https://claytondb.github.io/applewarranty/',
    localPath: 'dc-applewarranty',
  },

  // BUILDING/STARTED
  {
    id: '23',
    name: '3D Model Retopology',
    type: 'app',
    description: 'Cleans up topology of 3d scanned 3d models',
    status: 'building',
    priority: 'medium',
    revenue: '-',
    localPath: 'dc-AI-retopology',
  },
  {
    id: '24',
    name: 'Anywhere2Splat',
    type: 'app',
    description: 'Turn any location from Google Street View into a gaussian splat',
    status: 'building',
    priority: 'medium',
    revenue: '-',
    localPath: 'dc-anywheretosplat',
  },
  {
    id: '25',
    name: 'BikeVR',
    type: 'game',
    description: 'Bike around Google Street View in VR, AI blending',
    status: 'building',
    priority: 'medium',
    revenue: '-',
    localPath: 'dc-virtualbikeride',
  },
  {
    id: '26',
    name: 'YTVidMaker',
    type: 'app',
    description: 'YouTube Video Maker. Put in a prompt and it makes videos for you',
    status: 'building',
    priority: 'medium',
    revenue: '-',
    localPath: 'dc-ytvidmaker',
  },
  {
    id: '27',
    name: 'SoundBoost',
    type: 'app',
    description: 'Improves audio quality through AI',
    status: 'building',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '28',
    name: 'Webbot Clone',
    type: 'app',
    description: 'Webbot prediction system',
    status: 'building',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '29',
    name: '99 Floors',
    type: 'game',
    description: 'Unity VR game, liminal spaces',
    status: 'building',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '30',
    name: 'Recoil',
    type: 'game',
    description: 'Game - Reverse FPS adventure',
    status: 'building',
    priority: 'low',
    revenue: '-',
    localPath: 'dc-unshootgame',
  },
  {
    id: '31',
    name: 'Water Rings',
    type: 'game',
    description: 'Water Rings game in Unity, mobile game',
    status: 'building',
    priority: 'low',
    revenue: '-',
    localPath: 'dc-waterrings',
  },
  {
    id: '32',
    name: 'Meteos Clone',
    type: 'game',
    description: 'Clone of Meteos DS',
    status: 'building',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '33',
    name: 'Polaris',
    type: 'game',
    description: 'Polarium DS clone',
    status: 'building',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '34',
    name: 'Make Anything VR',
    type: 'game',
    description: 'Unity VR game, type in a prompt and it makes a 360 sphere around you of an image',
    status: 'building',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '35',
    name: 'Mens Mental Health App',
    type: 'app',
    description: 'Mens mental health app focused on stoicism, exercise, tough love',
    status: 'building',
    priority: 'low',
    revenue: '-',
  },

  // IDEAS
  {
    id: '36',
    name: '1-800-NOT-MY-PROBLEM',
    type: 'website',
    description: 'Website that\'s just all about chilling, how it\'s not my problem, dogs in hats and sunglasses relaxing',
    status: 'idea',
    priority: 'low',
    revenue: '-',
    localPath: '1800NOTMYPROBLEM',
  },
  {
    id: '37',
    name: 'B2C App Builder',
    type: 'app',
    description: 'B2C app builder',
    status: 'idea',
    priority: 'low',
    revenue: '-',
    localPath: 'dc-b2cappbuilder',
  },
  {
    id: '38',
    name: 'Midi 2 Image',
    type: 'app',
    description: 'Convert midi to image and vice versa. Or convert midi to QR code, scan it to play the midi file.',
    status: 'idea',
    priority: 'low',
    revenue: '-',
    localPath: 'dc-dcode-miditoimage',
  },
  {
    id: '39',
    name: 'Lego Racers Clone',
    type: 'game',
    description: 'Clone of Lego Racers game for PC, playable in browser',
    status: 'idea',
    priority: 'low',
    revenue: '-',
    localPath: 'dc-lego-racing-game',
  },
  {
    id: '40',
    name: 'Quest Direct Connect',
    type: 'app',
    description: 'Directly connect your PC to your meta quest over Wifi',
    status: 'idea',
    priority: 'low',
    revenue: '-',
    localPath: 'dc-questdirectconnect',
  },
  {
    id: '41',
    name: 'Text to Colorgrid',
    type: 'website',
    description: 'Convert text or song lyrics to a visual representation of colors in an image',
    status: 'idea',
    priority: 'low',
    revenue: '-',
    localPath: 'dc-text-to-colorgrid',
  },
  {
    id: '42',
    name: 'Auto Laugh Track',
    type: 'app',
    description: 'Plays laugh track as soon as you stop talking for a moment, maybe if it detects a joke.',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '43',
    name: 'Fishtank Site',
    type: 'app',
    description: 'Virtual fishtank, like a screensaver',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '44',
    name: 'Guitar Tuner',
    type: 'app',
    description: 'Free tuner with really easy UI',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '45',
    name: 'Is it Funny',
    type: 'app',
    description: 'Use AI to determine if something is funny or not, explain the joke and rate it on a scale',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '46',
    name: 'Not-AI',
    type: 'app',
    description: 'A site that doesn\'t register as AI for work/school networks, but you can use chatgpt',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '47',
    name: 'Self Hypnosis Platform',
    type: 'app',
    description: 'Hypnotherapy platform specialized in anxiety and depression, subscriptions',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '48',
    name: 'Lottery Number Predictor',
    type: 'app',
    description: 'Statistically recommended lottery numbers, using AI to predict',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '49',
    name: 'Weather Sound',
    type: 'app',
    description: 'Play sounds based on your local weather. Rain sound, wind sound, birds chirping, etc.',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '50',
    name: 'Cash Me If You Can',
    type: 'game',
    description: 'Guy that runs away from your cursor. If you catch him, he gives you money.',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '51',
    name: 'Electroplankton Clone',
    type: 'game',
    description: 'Web version of Electroplankton',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '52',
    name: 'Geometry Dash + Education',
    type: 'game',
    description: 'Educational version of geometry dash - you have to actually read and do math on the fly',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '53',
    name: 'Nintendogs VR',
    type: 'game',
    description: 'Clone of Nintendogs DS for VR',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '54',
    name: 'Slap You Later',
    type: 'game',
    description: 'Slap contest, like that crazy tv competition',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '55',
    name: 'Snood Clone',
    type: 'game',
    description: 'Snood clone',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '56',
    name: 'Tony Stonks Pro Trader',
    type: 'game',
    description: 'Skateboard around and invest',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '57',
    name: 'Unicorn Life',
    type: 'game',
    description: 'Relaxed game living as a unicorn, eat fruit, explore, meet other unicorns',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '58',
    name: 'Warcraft 2 Clone',
    type: 'game',
    description: 'Warcraft 2 clone with tons of players',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '59',
    name: 'Fire TLI Creator',
    type: 'website',
    description: 'Tool to help people who had a fire create a TLI of all their items.',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '60',
    name: 'Base64 Tool',
    type: 'website',
    description: 'Base 64 encoder/decoder tool',
    status: 'idea',
    priority: 'low',
    revenue: '-',
    localPath: 'dc-base64tool',
  },
  {
    id: '61',
    name: 'Just a House Fire',
    type: 'website',
    description: 'Comprehensive guide for house fire victims: insurance claims, contractor vetting, rebuilding timeline.',
    status: 'idea',
    priority: 'medium',
    revenue: '-',
  },
  {
    id: '62',
    name: '3D Model Maker',
    type: 'website',
    description: 'Upload an SVG or PNG and it will create a 3D model of an emboss/deboss stamp.',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '63',
    name: 'LipReader',
    type: 'app',
    description: 'Use AI to lip read, or listen and decode very quiet speech',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '64',
    name: 'Roblox Heist',
    type: 'game',
    description: 'Heist game in Roblox Studio',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '65',
    name: 'L3GOprint',
    type: 'app',
    description: 'Lego 3d printing app: Choose any project, it will make a 3d model set with all the pieces to 3d print.',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '66',
    name: 'Squirrel Game',
    type: 'game',
    description: 'You control a squirrel who can fly, dives down through tunnels. Carries a rocket gun. Searches for acorns.',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '67',
    name: 'VR Paint Can Physics',
    type: 'game',
    description: 'VR Painting game where you can throw paint cans, hang them from the ceiling like pendulums to paint.',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '68',
    name: 'VR Break Room',
    type: 'game',
    description: 'A continuously moving break room where you smash things in slow motion. Sword, vases, TVs, etc.',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '69',
    name: 'VR Polarium Clone',
    type: 'game',
    description: 'A VR game clone of the game Polarium that was on Nintendo DS',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '70',
    name: 'VR Lights Out Clone',
    type: 'game',
    description: 'VR game clone of the physical "Lights Out" game by Tiger',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '71',
    name: 'VR Musical Balls',
    type: 'game',
    description: 'Throw balls at a room space that plays music, musical tiles on the floor/walls/ceiling. It\'s a sequencer.',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '72',
    name: 'VR Living Space',
    type: 'game',
    description: 'Everyone is entitled to one space in this virtual world. Survey placement with like-minded individuals.',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '73',
    name: 'Bowln\'t',
    type: 'game',
    description: 'A VR game like "What the Golf?" But it\'s bowling',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
  {
    id: '74',
    name: 'iCloud Bulk Rename',
    type: 'app',
    description: 'Let users bulk rename files according to rules in iCloud',
    status: 'idea',
    priority: 'low',
    revenue: '-',
  },
];

const statusConfig = {
  live: { label: 'Live', class: 'badge-success', emoji: '🟢' },
  building: { label: 'Building', class: 'badge-warning', emoji: '🟡' },
  idea: { label: 'Idea', class: 'badge-muted', emoji: '💭' },
  paused: { label: 'Paused', class: 'badge-danger', emoji: '⏸️' },
};

const priorityConfig = {
  high: { label: 'High', class: 'text-red-400' },
  medium: { label: 'Med', class: 'text-yellow-400' },
  low: { label: 'Low', class: 'text-gray-500' },
};

const typeConfig = {
  app: { label: 'App', emoji: '📱' },
  game: { label: 'Game', emoji: '🎮' },
  website: { label: 'Web', emoji: '🌐' },
};

export default function ProjectTracker() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ProjectType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({ 
    name: '', 
    description: '',
    type: 'app' as ProjectType,
    status: 'idea' as Status, 
    priority: 'medium' as Priority 
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setProjects(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage on change (after initial load)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const filteredProjects = projects
    .filter(p => filter === 'all' || p.status === filter)
    .filter(p => typeFilter === 'all' || p.type === typeFilter)
    .filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );

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
      description: newProject.description,
      type: newProject.type,
      status: newProject.status,
      priority: newProject.priority,
      revenue: '-',
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setProjects([project, ...projects]);
    setNewProject({ name: '', description: '', type: 'app', status: 'idea', priority: 'medium' });
    setShowAddForm(false);
  };

  const updateStatus = (id: string, status: Status) => {
    setProjects(projects.map(p => 
      p.id === id ? { ...p, status, lastUpdated: new Date().toISOString().split('T')[0] } : p
    ));
  };

  const updatePriority = (id: string, priority: Priority) => {
    setProjects(projects.map(p => 
      p.id === id ? { ...p, priority } : p
    ));
  };

  const resetToDefault = () => {
    if (confirm('Reset all projects to default? This will lose any changes.')) {
      localStorage.removeItem(STORAGE_KEY);
      setProjects(defaultProjects);
    }
  };

  return (
    <div>
      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card text-center cursor-pointer hover:border-[var(--success)]" onClick={() => setFilter(filter === 'live' ? 'all' : 'live')}>
          <div className="text-3xl font-bold text-[var(--success)]">{stats.live}</div>
          <div className="text-sm text-[var(--muted)]">Live</div>
        </div>
        <div className="card text-center cursor-pointer hover:border-[var(--warning)]" onClick={() => setFilter(filter === 'building' ? 'all' : 'building')}>
          <div className="text-3xl font-bold text-[var(--warning)]">{stats.building}</div>
          <div className="text-sm text-[var(--muted)]">Building</div>
        </div>
        <div className="card text-center cursor-pointer hover:border-[var(--muted)]" onClick={() => setFilter(filter === 'idea' ? 'all' : 'idea')}>
          <div className="text-3xl font-bold text-[var(--muted)]">{stats.ideas}</div>
          <div className="text-sm text-[var(--muted)]">Ideas</div>
        </div>
        <div className="card text-center cursor-pointer" onClick={() => setFilter('all')}>
          <div className="text-3xl font-bold">{stats.total}</div>
          <div className="text-sm text-[var(--muted)]">Total</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search projects..."
          className="input flex-1 min-w-[200px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input w-32"
          value={filter}
          onChange={(e) => setFilter(e.target.value as Status | 'all')}
        >
          <option value="all">All Status</option>
          <option value="live">🟢 Live</option>
          <option value="building">🟡 Building</option>
          <option value="idea">💭 Idea</option>
          <option value="paused">⏸️ Paused</option>
        </select>
        <select
          className="input w-32"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as ProjectType | 'all')}
        >
          <option value="all">All Types</option>
          <option value="app">📱 Apps</option>
          <option value="game">🎮 Games</option>
          <option value="website">🌐 Websites</option>
        </select>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          + Add
        </button>
        <button className="btn btn-ghost text-sm" onClick={resetToDefault}>
          Reset
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="card mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-[var(--muted)] mb-1 block">Project Name</label>
              <input
                type="text"
                className="input"
                placeholder="Project name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-[var(--muted)] mb-1 block">Type</label>
              <select
                className="input"
                value={newProject.type}
                onChange={(e) => setNewProject({ ...newProject, type: e.target.value as ProjectType })}
              >
                <option value="app">📱 App</option>
                <option value="game">🎮 Game</option>
                <option value="website">🌐 Website</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm text-[var(--muted)] mb-1 block">Description</label>
            <input
              type="text"
              className="input"
              placeholder="Brief description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
          </div>
          <div className="flex gap-4 items-end">
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
            <button className="btn btn-primary" onClick={addProject}>Add Project</button>
            <button className="btn btn-ghost" onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-[var(--muted)] mb-3">
        Showing {filteredProjects.length} of {projects.length} projects
      </div>

      {/* Projects Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-sm text-[var(--muted)]">
                <th className="p-4">Project</th>
                <th className="p-4 w-24">Type</th>
                <th className="p-4 w-28">Status</th>
                <th className="p-4 w-20">Priority</th>
                <th className="p-4">Description</th>
                <th className="p-4 w-24">Links</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr 
                  key={project.id} 
                  className="border-b border-[var(--border)] hover:bg-[var(--card-hover)] transition-colors"
                >
                  <td className="p-4 font-medium">{project.name}</td>
                  <td className="p-4 text-sm">
                    <span>{typeConfig[project.type].emoji} {typeConfig[project.type].label}</span>
                  </td>
                  <td className="p-4">
                    <select
                      className={`badge ${statusConfig[project.status].class} bg-transparent border-none cursor-pointer text-sm`}
                      value={project.status}
                      onChange={(e) => updateStatus(project.id, e.target.value as Status)}
                    >
                      <option value="live">🟢 Live</option>
                      <option value="building">🟡 Building</option>
                      <option value="idea">💭 Idea</option>
                      <option value="paused">⏸️ Paused</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <select
                      className={`${priorityConfig[project.priority].class} bg-transparent border-none cursor-pointer text-sm`}
                      value={project.priority}
                      onChange={(e) => updatePriority(project.id, e.target.value as Priority)}
                    >
                      <option value="high">🔴 High</option>
                      <option value="medium">🟡 Med</option>
                      <option value="low">⚪ Low</option>
                    </select>
                  </td>
                  <td className="p-4 text-sm text-[var(--muted)] max-w-md truncate" title={project.description}>
                    {project.description}
                  </td>
                  <td className="p-4 flex gap-2">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--accent)] hover:underline text-sm"
                      >
                        🔗
                      </a>
                    )}
                    {project.localPath && (
                      <span className="text-[var(--muted)] text-sm" title={project.localPath}>
                        📁
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProjects.length === 0 && (
          <div className="p-8 text-center text-[var(--muted)]">
            No projects found
          </div>
        )}
      </div>
    </div>
  );
}
