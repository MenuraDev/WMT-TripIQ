import { Article, Writer, AdSlot, AdCampaign } from './types';

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'The Future of Minimalist Hardware',
    excerpt: 'How transparent design is changing our relationship with technology.',
    content: 'Full content here...',
    authorId: 'w1',
    authorName: 'Carl Pei',
    category: 'Hardware',
    status: 'published',
    createdAt: '2026-04-10T10:00:00Z',
    updatedAt: '2026-04-10T10:00:00Z',
    views: 12400,
    reads: 8900,
    likes: 450,
    imageUrl: 'https://picsum.photos/seed/tech1/800/400'
  },
  {
    id: '2',
    title: 'Dot Matrix: A Typography Revival',
    excerpt: 'Why the aesthetic of the 80s is making a comeback in modern OS design.',
    content: 'Full content here...',
    authorId: 'w2',
    authorName: 'Jane Doe',
    category: 'Design',
    status: 'published',
    createdAt: '2026-04-11T08:30:00Z',
    updatedAt: '2026-04-11T08:30:00Z',
    views: 8200,
    reads: 5100,
    likes: 320,
    imageUrl: 'https://picsum.photos/seed/design1/800/400'
  },
  {
    id: '3',
    title: 'AI and the Glyph Language',
    excerpt: 'Communicating with machines through visual symbols rather than text.',
    content: 'Full content here...',
    authorId: 'w1',
    authorName: 'Carl Pei',
    category: 'Future',
    status: 'in_review',
    createdAt: '2026-04-11T12:00:00Z',
    updatedAt: '2026-04-11T12:00:00Z',
    views: 0,
    reads: 0,
    likes: 0,
    imageUrl: 'https://picsum.photos/seed/future1/800/400'
  }
];

export const MOCK_WRITERS: Writer[] = [
  {
    id: 'w1',
    name: 'Carl Pei',
    email: 'carl@nothing.tech',
    role: 'editor',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carl',
    stats: {
      totalViews: 45000,
      totalReads: 32000,
      totalLikes: 1200
    }
  },
  {
    id: 'w2',
    name: 'Jane Doe',
    email: 'jane@nothing.tech',
    role: 'writer',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    stats: {
      totalViews: 12000,
      totalReads: 8000,
      totalLikes: 450
    }
  }
];

export const MOCK_AD_SLOTS: AdSlot[] = [
  { id: 's1', name: 'Main Hero Banner', size: '728x90', activeAdId: 'c1', cpm: 12.5, zone: 'homepage_banner' },
  { id: 's2', name: 'Sidebar Widget', size: '300x250', activeAdId: 'c2', cpm: 8.0, zone: 'sidebar' },
  { id: 's3', name: 'Ticker Sponsor', size: 'Text Only', activeAdId: 'c3', cpm: 5.0, zone: 'ticker' }
];

export const MOCK_CAMPAIGNS: AdCampaign[] = [
  {
    id: 'c1',
    name: 'Ear (open) Launch',
    type: 'image',
    content: 'https://picsum.photos/seed/ad1/728/90',
    status: 'active',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    metrics: { impressions: 150000, clicks: 4500, ctr: 3.0, revenue: 1875 }
  },
  {
    id: 'c2',
    name: 'Phone (2a) Special Offer',
    type: 'image',
    content: 'https://picsum.photos/seed/ad2/300/250',
    status: 'active',
    startDate: '2026-04-05',
    endDate: '2026-05-05',
    metrics: { impressions: 80000, clicks: 1200, ctr: 1.5, revenue: 640 }
  }
];
