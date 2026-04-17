import * as React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  FileText, 
  Eye, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Edit3,
  MoreVertical,
  UserPlus
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '../../lib/utils';
import { MOCK_ARTICLES, MOCK_WRITERS } from '@/constants';
import { GlassCard, DotMatrixText, GlyphIcon, LEDStatus } from '@/components/NothingUI';
import { Badge } from '../../components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';

const ANALYTICS_DATA = [
  { name: '00:00', views: 400 },
  { name: '04:00', views: 300 },
  { name: '08:00', views: 900 },
  { name: '12:00', views: 1500 },
  { name: '16:00', views: 1200 },
  { name: '20:00', views: 1800 },
  { name: '23:59', views: 1400 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-tighter">Command Center</h2>
          <DotMatrixText className="text-xs text-white/40">System Status: Operational</DotMatrixText>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-none uppercase tracking-widest text-[10px]">
            <GlyphIcon icon={TrendingUp} className="mr-2" />
            Export Report
          </Button>
          <Button className="bg-white text-black hover:bg-white/90 rounded-none uppercase tracking-widest text-[10px]">
            <GlyphIcon icon={UserPlus} className="mr-2" />
            Invite Writer
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Articles', value: '124', icon: FileText, trend: '+12%' },
          { label: 'Active Writers', value: '18', icon: Users, trend: '0%' },
          { label: 'Page Views', value: '84.2K', icon: Eye, trend: '+24%' },
          { label: 'Avg. Read Time', value: '4:20', icon: TrendingUp, trend: '+5%' },
        ].map((metric, i) => (
          <GlassCard key={i} className="flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-white/5 border border-white/10">
                <GlyphIcon icon={metric.icon} className="w-4 h-4 text-white/60" />
              </div>
              <span className="text-[10px] text-green-500 dot-matrix">{metric.trend}</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-white/40 mb-1">{metric.label}</p>
              <h3 className="text-3xl font-bold tracking-tight">{metric.value}</h3>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Chart */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm uppercase tracking-widest font-bold">Traffic Overview</h3>
            <div className="flex gap-2">
              {['24H', '7D', '30D'].map(t => (
                <button key={t} className={cn("text-[10px] px-2 py-1 border border-white/10 dot-matrix", t === '24H' ? "bg-white text-black" : "text-white/40")}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS_DATA}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff40" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  fontFamily="Space Mono"
                />
                <YAxis 
                  stroke="#ffffff40" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  fontFamily="Space Mono"
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0px' }}
                  itemStyle={{ color: '#fff', fontSize: '10px', textTransform: 'uppercase', fontFamily: 'Space Mono' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#ffffff" 
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Pending Moderation */}
        <GlassCard>
          <h3 className="text-sm uppercase tracking-widest font-bold mb-6">Moderation Queue</h3>
          <div className="space-y-4">
            {MOCK_ARTICLES.filter(a => a.status === 'in_review').map(article => (
              <div key={article.id} className="p-4 border border-white/10 space-y-3 hover:bg-white/5 transition-colors group">
                <div className="flex justify-between items-start">
                  <LEDStatus status="amber" />
                  <span className="text-[10px] text-white/40 dot-matrix">Pending</span>
                </div>
                <h4 className="text-sm font-bold uppercase tracking-tight line-clamp-1">{article.title}</h4>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">By {article.authorName}</p>
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 py-2 bg-white/5 border border-white/10 hover:bg-green-500/20 hover:border-green-500/50 transition-all">
                    <GlyphIcon icon={CheckCircle2} className="w-3 h-3 text-green-500" />
                  </button>
                  <button className="flex-1 py-2 bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/50 transition-all">
                    <GlyphIcon icon={XCircle} className="w-3 h-3 text-red-500" />
                  </button>
                  <button className="flex-1 py-2 bg-white/5 border border-white/10 hover:bg-white/20 transition-all">
                    <GlyphIcon icon={Edit3} className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            <button className="w-full py-3 border border-dashed border-white/20 text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white hover:border-white/40 transition-all">
              View All Pending
            </button>
          </div>
        </GlassCard>
      </div>

      {/* User Management Table */}
      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm uppercase tracking-widest font-bold">Writer Directory</h3>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="SEARCH WRITERS..." 
              className="bg-transparent border border-white/10 px-4 py-1 text-[10px] uppercase tracking-widest focus:outline-none focus:border-white/40"
            />
          </div>
        </div>
        <Table>
          <TableHeader className="border-b border-white/10">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Writer</TableHead>
              <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Role</TableHead>
              <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Articles</TableHead>
              <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Total Views</TableHead>
              <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_WRITERS.map((writer) => (
              <TableRow key={writer.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <img src={writer.avatarUrl} alt={writer.name} className="w-8 h-8 rounded-full border border-white/10" referrerPolicy="no-referrer" />
                    <div>
                      <p className="text-sm font-bold uppercase tracking-tight">{writer.name}</p>
                      <p className="text-[10px] text-white/40">{writer.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-transparent border border-white/20 text-white/60 rounded-none text-[9px] uppercase tracking-widest">
                    {writer.role}
                  </Badge>
                </TableCell>
                <TableCell className="dot-matrix text-xs">24</TableCell>
                <TableCell className="dot-matrix text-xs">{writer.stats.totalViews.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <LEDStatus status="green" />
                    <span className="text-[10px] uppercase tracking-widest text-white/60">Active</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <button className="p-2 hover:bg-white/10 transition-colors">
                    <GlyphIcon icon={MoreVertical} className="w-4 h-4 text-white/40" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </GlassCard>
    </div>
  );
}
