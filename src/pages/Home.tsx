import * as React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Clock, User } from 'lucide-react';
import { MOCK_ARTICLES } from '@/constants';
import { GlassCard, DotMatrixText, GlyphIcon } from '@/components/NothingUI';
import { Badge } from '../../components/ui/badge';

export default function Home() {
  const featuredArticle = MOCK_ARTICLES[0];
  const otherArticles = MOCK_ARTICLES.slice(1);

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <GlassCard className="h-full p-0 overflow-hidden group">
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={featuredArticle.imageUrl} 
                alt={featuredArticle.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-0 p-8 space-y-4">
                <Badge className="bg-white text-black hover:bg-white/90 rounded-none px-3 py-1 dot-matrix text-[10px]">
                  Featured / {featuredArticle.category}
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-none">
                  {featuredArticle.title}
                </h2>
                <p className="text-white/60 max-w-xl text-lg">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-widest">
                    <GlyphIcon icon={User} className="w-3 h-3" />
                    {featuredArticle.authorName}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-widest">
                    <GlyphIcon icon={Clock} className="w-3 h-3" />
                    {new Date(featuredArticle.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
        
        <div className="lg:col-span-4 flex flex-col gap-6">
          <GlassCard className="flex-1 flex flex-col justify-center text-center border-dashed border-white/20">
            <DotMatrixText className="text-4xl mb-2">03.0</DotMatrixText>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">OS Version</p>
            <div className="mt-6">
              <button className="px-6 py-2 border border-white/20 hover:bg-white hover:text-black transition-all text-xs uppercase tracking-widest">
                Learn More
              </button>
            </div>
          </GlassCard>
          
          <GlassCard className="flex-1 bg-nothing-red/10 border-nothing-red/20">
            <div className="flex justify-between items-start">
              <Badge className="bg-nothing-red text-white rounded-none px-2 py-0.5 dot-matrix text-[8px]">Live</Badge>
              <GlyphIcon icon={ArrowUpRight} className="text-nothing-red" />
            </div>
            <h3 className="text-xl font-bold mt-4 uppercase tracking-tight">Community Event: London</h3>
            <p className="text-sm text-white/60 mt-2">Join us for the unveiling of our latest hardware experiment.</p>
          </GlassCard>
        </div>
      </section>

      {/* Grid Layout */}
      <section>
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold uppercase tracking-tighter">Latest Stories</h2>
          <div className="flex gap-4">
            {['All', 'Tech', 'Design', 'Future'].map(cat => (
              <button key={cat} className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors dot-matrix">
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherArticles.map((article) => (
            <GlassCard key={article.id} className="flex flex-col h-full">
              <div className="aspect-[16/10] overflow-hidden mb-6">
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <Badge className="w-fit mb-4 bg-white/5 text-white/60 border-white/10 rounded-none px-2 py-0.5 text-[9px] uppercase tracking-widest">
                {article.category}
              </Badge>
              <h3 className="text-xl font-bold leading-tight mb-3 group-hover:text-nothing-red transition-colors">
                {article.title}
              </h3>
              <p className="text-white/40 text-sm line-clamp-2 mb-6">
                {article.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-[10px] uppercase tracking-widest text-white/30">{article.authorName}</span>
                <button className="p-2 hover:bg-white/10 transition-colors">
                  <GlyphIcon icon={ArrowUpRight} className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          ))}
          
          {/* Newsletter Card */}
          <GlassCard className="bg-white text-black flex flex-col justify-center items-center text-center">
            <DotMatrixText className="text-2xl mb-4">Stay Connected</DotMatrixText>
            <p className="text-xs uppercase tracking-widest mb-6 opacity-70 leading-relaxed">
              Get the latest updates on Nothing hardware and software directly in your inbox.
            </p>
            <div className="w-full space-y-2">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="w-full bg-transparent border-b border-black/20 py-2 text-xs uppercase tracking-widest focus:outline-none focus:border-black"
              />
              <button className="w-full bg-black text-white py-3 text-xs uppercase tracking-widest hover:bg-black/80 transition-colors">
                Subscribe
              </button>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
