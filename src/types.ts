export type Role = 'admin' | 'writer' | 'ad_manager' | 'guest';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  authorId: string;
  authorName: string;
  category: 'Tech' | 'Design' | 'Future' | 'Hardware';
  status: 'draft' | 'in_review' | 'published';
  createdAt: string;
  updatedAt: string;
  views: number;
  reads: number;
  likes: number;
  imageUrl: string;
}

export interface Writer {
  id: string;
  name: string;
  email: string;
  role: 'writer' | 'editor';
  avatarUrl: string;
  stats: {
    totalViews: number;
    totalReads: number;
    totalLikes: number;
  };
}

export interface AdSlot {
  id: string;
  name: string;
  size: string;
  activeAdId?: string;
  cpm: number;
  zone: 'homepage_banner' | 'sidebar' | 'in_article' | 'ticker';
}

export interface AdCampaign {
  id: string;
  name: string;
  type: 'image' | 'text' | 'script';
  content: string;
  status: 'active' | 'paused' | 'scheduled';
  startDate: string;
  endDate: string;
  metrics: {
    impressions: number;
    clicks: number;
    ctr: number;
    revenue: number;
  };
}
