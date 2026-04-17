import * as React from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Search, 
  Image as ImageIcon, 
  Send, 
  Save, 
  Eye, 
  Clock,
  ChevronRight,
  MoreHorizontal,
  Bold,
  Italic,
  Link as LinkIcon,
  Type
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { MOCK_ARTICLES } from '@/constants';
import { GlassCard, DotMatrixText, GlyphIcon, LEDStatus } from '@/components/NothingUI';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ScrollArea } from '../../components/ui/scroll-area';
import { toast } from 'sonner';

export default function WriterWorkspace() {
  const [content, setContent] = React.useState('# New Article\n\nStart typing here...');
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);

  const handlePublish = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: 'Submitting for review...',
      success: 'Article submitted successfully!',
      error: 'Failed to submit article.',
      className: 'dot-matrix'
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-tighter">Workspace</h2>
          <DotMatrixText className="text-xs text-white/40">Drafts: 4 | Published: 12</DotMatrixText>
        </div>
        <Button 
          onClick={() => setIsEditorOpen(true)}
          className="bg-white text-black hover:bg-white/90 rounded-none uppercase tracking-widest text-[10px]"
        >
          <GlyphIcon icon={Plus} className="mr-2" />
          New Article
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Drafts & Stats */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="p-4">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4 font-bold">Personal Stats</h3>
            <div className="space-y-4">
              {[
                { label: 'Total Reads', value: '12.4K' },
                { label: 'Avg. Engagement', value: '68%' },
                { label: 'Likes', value: '450' },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-end">
                  <span className="text-[10px] uppercase tracking-widest text-white/30">{stat.label}</span>
                  <span className="text-lg font-bold dot-matrix">{stat.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-0 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Recent Drafts</h3>
              <GlyphIcon icon={Search} className="w-3 h-3 text-white/40" />
            </div>
            <ScrollArea className="h-[400px]">
              <div className="divide-y divide-white/5">
                {MOCK_ARTICLES.map((draft) => (
                  <button 
                    key={draft.id} 
                    className="w-full p-4 text-left hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <Badge className="bg-transparent border border-white/10 text-[8px] rounded-none px-1 py-0 uppercase tracking-widest text-white/40">
                        {draft.category}
                      </Badge>
                      <span className="text-[8px] dot-matrix text-white/20">2h ago</span>
                    </div>
                    <h4 className="text-sm font-bold uppercase tracking-tight line-clamp-1 group-hover:text-white transition-colors">{draft.title}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <LEDStatus status={draft.status === 'published' ? 'green' : 'amber'} />
                      <span className="text-[9px] uppercase tracking-widest text-white/30">{draft.status.replace('_', ' ')}</span>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </GlassCard>
        </div>

        {/* Main Area: Editor or List */}
        <div className="lg:col-span-3">
          {isEditorOpen ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-4">
                  <button onClick={() => setIsEditorOpen(false)} className="p-2 hover:bg-white/5 transition-colors">
                    <GlyphIcon icon={ChevronRight} className="rotate-180" />
                  </button>
                  <h3 className="text-sm uppercase tracking-widest font-bold">Editor / New Draft</h3>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-none uppercase tracking-widest text-[10px]">
                    <GlyphIcon icon={Save} className="mr-2" />
                    Save Draft
                  </Button>
                  <Button 
                    onClick={handlePublish}
                    className="bg-white text-black hover:bg-white/90 rounded-none uppercase tracking-widest text-[10px]"
                  >
                    <GlyphIcon icon={Send} className="mr-2" />
                    Submit for Review
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
                {/* Markdown Input */}
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2 p-1 bg-white/5 border border-white/10 w-fit">
                    {[Bold, Italic, LinkIcon, ImageIcon, Type].map((Icon, i) => (
                      <button key={i} className="p-2 hover:bg-white/10 transition-colors">
                        <GlyphIcon icon={Icon} className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex-1 bg-transparent border border-white/10 p-6 font-mono text-sm focus:outline-none focus:border-white/40 resize-none"
                    placeholder="Write your story..."
                  />
                </div>

                {/* Preview */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40 p-2">
                    <GlyphIcon icon={Eye} className="w-3 h-3" />
                    Live Preview
                  </div>
                  <div className="flex-1 border border-white/10 p-8 overflow-y-auto prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-sm uppercase tracking-widest font-bold">Published Articles</h3>
                <div className="flex gap-4">
                  <button className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white dot-matrix">Sort: Newest</button>
                  <button className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white dot-matrix">Filter: All</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_ARTICLES.filter(a => a.status === 'published').map(article => (
                  <GlassCard key={article.id} className="group">
                    <div className="flex justify-between items-start mb-4">
                      <Badge className="bg-white/5 text-white/60 border-white/10 rounded-none px-2 py-0.5 text-[9px] uppercase tracking-widest">
                        {article.category}
                      </Badge>
                      <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GlyphIcon icon={MoreHorizontal} />
                      </button>
                    </div>
                    <h4 className="text-lg font-bold uppercase tracking-tight mb-4">{article.title}</h4>
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-white/40">
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1"><GlyphIcon icon={Eye} className="w-3 h-3" /> {article.views}</span>
                        <span className="flex items-center gap-1"><GlyphIcon icon={Clock} className="w-3 h-3" /> 4m read</span>
                      </div>
                      <span className="dot-matrix">{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
