import * as React from 'react';
import { motion } from 'motion/react';
import { 
  Megaphone, 
  Plus, 
  Layout, 
  BarChart3, 
  Calendar as CalendarIcon,
  Upload,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Settings2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from '../../lib/utils';
import { MOCK_AD_SLOTS, MOCK_CAMPAIGNS } from '@/constants';
import { GlassCard, DotMatrixText, GlyphIcon, LEDStatus } from '@/components/NothingUI';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Calendar } from '../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { format } from 'date-fns';

const AD_PERFORMANCE_DATA = [
  { name: 'Mon', revenue: 400, clicks: 240 },
  { name: 'Tue', revenue: 300, clicks: 139 },
  { name: 'Wed', revenue: 200, clicks: 980 },
  { name: 'Thu', revenue: 278, clicks: 390 },
  { name: 'Fri', revenue: 189, clicks: 480 },
  { name: 'Sat', revenue: 239, clicks: 380 },
  { name: 'Sun', revenue: 349, clicks: 430 },
];

export default function AdManagement() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-tighter">Ad Inventory</h2>
          <DotMatrixText className="text-xs text-white/40">Active Campaigns: 8 | Revenue: $12,450.00</DotMatrixText>
        </div>
        <Button className="bg-white text-black hover:bg-white/90 rounded-none uppercase tracking-widest text-[10px]">
          <GlyphIcon icon={Plus} className="mr-2" />
          Create Campaign
        </Button>
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 rounded-none p-1 mb-8">
          <TabsTrigger value="inventory" className="rounded-none uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:text-black">
            <GlyphIcon icon={Layout} className="mr-2 w-3 h-3" />
            Inventory & Placements
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="rounded-none uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:text-black">
            <GlyphIcon icon={Megaphone} className="mr-2 w-3 h-3" />
            Active Campaigns
          </TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-none uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:text-black">
            <GlyphIcon icon={BarChart3} className="mr-2 w-3 h-3" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_AD_SLOTS.map((slot) => (
              <GlassCard key={slot.id} className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <Badge className="bg-white/5 text-white/60 border-white/10 rounded-none px-2 py-0.5 text-[8px] uppercase tracking-widest">
                    {slot.zone.replace('_', ' ')}
                  </Badge>
                  <button className="p-1 hover:bg-white/10 transition-colors">
                    <GlyphIcon icon={Settings2} className="w-3 h-3 text-white/40" />
                  </button>
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-tight">{slot.name}</h4>
                  <p className="text-[10px] text-white/40 dot-matrix mt-1">{slot.size}</p>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                  <div>
                    <p className="text-[8px] uppercase tracking-widest text-white/20 mb-1">Current CPM</p>
                    <p className="text-lg font-bold dot-matrix">${slot.cpm.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <LEDStatus status={slot.activeAdId ? 'green' : 'red'} />
                    <span className="text-[9px] uppercase tracking-widest text-white/40">{slot.activeAdId ? 'Active' : 'Empty'}</span>
                  </div>
                </div>
              </GlassCard>
            ))}
            <button className="border border-dashed border-white/20 flex flex-col items-center justify-center p-6 hover:bg-white/5 transition-all group">
              <GlyphIcon icon={Plus} className="w-6 h-6 text-white/20 group-hover:text-white transition-colors mb-2" />
              <span className="text-[10px] uppercase tracking-widest text-white/40">Add New Slot</span>
            </button>
          </div>

          {/* Visual Placement Editor Mockup */}
          <GlassCard className="p-8">
            <h3 className="text-sm uppercase tracking-widest font-bold mb-8">Visual Placement Editor</h3>
            <div className="border border-white/10 aspect-[21/9] relative bg-black/40 overflow-hidden">
              <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-2 p-4 opacity-20">
                {Array.from({ length: 72 }).map((_, i) => (
                  <div key={i} className="border border-white/10" />
                ))}
              </div>
              
              {/* Draggable Zone Mocks */}
              <motion.div 
                drag 
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                className="absolute top-4 left-4 right-4 h-12 bg-nothing-red/20 border border-nothing-red/50 flex items-center justify-center cursor-move group"
              >
                <span className="text-[10px] uppercase tracking-widest text-nothing-red font-bold">Homepage Banner Zone</span>
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Badge className="bg-nothing-red text-white rounded-none text-[8px]">728x90</Badge>
                </div>
              </motion.div>

              <motion.div 
                drag 
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                className="absolute top-20 right-4 w-48 bottom-4 bg-white/5 border border-white/20 flex items-center justify-center cursor-move group"
              >
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Sidebar Zone</span>
                <div className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Badge className="bg-white text-black rounded-none text-[8px]">300x600</Badge>
                </div>
              </motion.div>
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="campaigns">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {MOCK_CAMPAIGNS.map((campaign) => (
              <GlassCard key={campaign.id} className="flex gap-6">
                <div className="w-32 h-32 bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                  <img src={campaign.content} alt={campaign.name} className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold uppercase tracking-tight">{campaign.name}</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Type: {campaign.type}</p>
                    </div>
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20 rounded-none text-[8px] uppercase tracking-widest">
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                    <div>
                      <p className="text-[8px] uppercase tracking-widest text-white/20 mb-1">Impressions</p>
                      <p className="text-sm font-bold dot-matrix">{campaign.metrics.impressions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-widest text-white/20 mb-1">Clicks</p>
                      <p className="text-sm font-bold dot-matrix">{campaign.metrics.clicks.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-widest text-white/20 mb-1">Revenue</p>
                      <p className="text-sm font-bold dot-matrix">${campaign.metrics.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Total Impressions', value: '2.4M', trend: '+12.5%', up: true },
              { label: 'Avg. CTR', value: '2.1%', trend: '-0.4%', up: false },
              { label: 'Total Revenue', value: '$42,850', trend: '+8.2%', up: true },
            ].map((stat, i) => (
              <GlassCard key={i}>
                <p className="text-xs uppercase tracking-widest text-white/40 mb-2">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
                  <div className={cn("flex items-center gap-1 text-[10px] dot-matrix", stat.up ? "text-green-500" : "text-red-500")}>
                    <GlyphIcon icon={stat.up ? ArrowUpRight : ArrowDownRight} className="w-3 h-3" />
                    {stat.trend}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          <GlassCard className="h-[400px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm uppercase tracking-widest font-bold">Revenue vs Clicks</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white" />
                  <span className="text-[10px] uppercase tracking-widest text-white/40">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white/20" />
                  <span className="text-[10px] uppercase tracking-widest text-white/40">Clicks</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={AD_PERFORMANCE_DATA}>
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
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0px' }}
                  itemStyle={{ color: '#fff', fontSize: '10px', textTransform: 'uppercase', fontFamily: 'Space Mono' }}
                />
                <Bar dataKey="revenue" fill="#ffffff" radius={[0, 0, 0, 0]} />
                <Bar dataKey="clicks" fill="#ffffff20" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
