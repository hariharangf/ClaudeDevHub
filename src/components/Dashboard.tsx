import React, { useState, useEffect } from 'react';
import { Resource } from '../types';
import { RESOURCES } from '../data/resources';
import { 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  Check, 
  Copy, 
  BookOpen, 
  Terminal, 
  Compass, 
  FileText, 
  Cpu, 
  ShieldAlert, 
  Code, 
  Lightbulb, 
  GraduationCap, 
  Layers, 
  Server, 
  Sparkles, 
  Play, 
  Zap, 
  Blocks, 
  Flame,
  TrendingUp,
  Award,
  Link as LinkIcon 
} from 'lucide-react';

const categoryIcons: { [key: string]: any } = {
  Terminal: Terminal,
  BookOpen: BookOpen,
  Compass: Compass,
  FileText: FileText,
  Cpu: Cpu,
  ShieldAlert: ShieldAlert,
  Code: Code,
  Lightbulb: Lightbulb,
  GraduationCap: GraduationCap,
  Layers: Layers,
  Server: Server,
  Sparkles: Sparkles,
  Play: Play,
  Zap: Zap,
  Blocks: Blocks,
  Link: LinkIcon
};

const INITIAL_STATS: Record<string, { clicks: number; views: number }> = {
  'anthropic-console': { clicks: 145, views: 520 },
  'anthropic-api-docs': { clicks: 198, views: 680 },
  'anthropic-cookbook': { clicks: 112, views: 420 },
  'claude-prompt-library': { clicks: 176, views: 580 },
  'mcp-official-docs': { clicks: 134, views: 490 },
  'anthropic-system-prompts': { clicks: 85, views: 320 },
  'sdk-typescript': { clicks: 210, views: 720 },
  'sdk-python': { clicks: 165, views: 590 },
  'sdk-go': { clicks: 54, views: 210 },
  'sdk-rust': { clicks: 42, views: 180 },
  'anthropic-metaprompt': { clicks: 122, views: 430 },
  'prompt-eng-tutorial': { clicks: 148, views: 510 },
  'promptlayer': { clicks: 76, views: 290 },
  'mcp-servers-hub': { clicks: 154, views: 530 },
  'claude-code': { clicks: 284, views: 920 },
  'cursor-editor': { clicks: 232, views: 810 },
  'cline-agent': { clicks: 192, views: 710 },
  'aider-cli': { clicks: 180, views: 640 },
  'vercel-ai-sdk': { clicks: 168, views: 590 },
  'langchain-anthropic': { clicks: 115, views: 450 },
};

export default function Dashboard() {
  const [resources] = useState<Resource[]>(RESOURCES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlyOfficial, setOnlyOfficial] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Trending states
  const [trendingSortBy, setTrendingSortBy] = useState<'clicks' | 'views'>('clicks');
  const [highlightedCardId, setHighlightedCardId] = useState<string | null>(null);
  const [simulationFlash, setSimulationFlash] = useState(false);
  const [resourceStats, setResourceStats] = useState<Record<string, { clicks: number; views: number }>>(() => {
    const saved = localStorage.getItem('claude_resource_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse stats', e);
      }
    }
    return INITIAL_STATS;
  });

  // Initialize bookmarks from local storage
  useEffect(() => {
    const saved = localStorage.getItem('claude_bookmarks');
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse bookmarks', e);
      }
    }
  }, []);

  const saveStats = (newStats: Record<string, { clicks: number; views: number }>) => {
    setResourceStats(newStats);
    localStorage.setItem('claude_resource_stats', JSON.stringify(newStats));
  };

  const handleResourceClick = (id: string) => {
    const current = resourceStats[id] || { clicks: 0, views: 0 };
    const updated = {
      ...resourceStats,
      [id]: {
        clicks: current.clicks + 1,
        views: current.views + 3, // Access triggers views as well
      }
    };
    saveStats(updated);
  };

  const toggleBookmark = (id: string) => {
    let updated;
    if (bookmarks.includes(id)) {
      updated = bookmarks.filter(b => b !== id);
    } else {
      updated = [...bookmarks, id];
    }
    setBookmarks(updated);
    localStorage.setItem('claude_bookmarks', JSON.stringify(updated));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const simulateTrafficWave = () => {
    const updated = { ...resourceStats };
    // Choose 3 random resources
    const randomIds: string[] = [];
    while (randomIds.length < 3) {
      const idx = Math.floor(Math.random() * resources.length);
      const rid = resources[idx].id;
      if (!randomIds.includes(rid)) {
        randomIds.push(rid);
      }
    }

    randomIds.forEach(id => {
      const current = updated[id] || { clicks: 0, views: 0 };
      updated[id] = {
        clicks: current.clicks + Math.floor(Math.random() * 12) + 4,
        views: current.views + Math.floor(Math.random() * 50) + 15,
      };
    });

    saveStats(updated);
    setSimulationFlash(true);
    setTimeout(() => setSimulationFlash(false), 800);
  };

  const scrollToAndHighlightCard = (id: string) => {
    const resObj = resources.find(r => r.id === id);
    if (resObj) {
      // Clear filters so the card actually displays
      if (selectedCategory !== 'All' && selectedCategory !== 'Bookmarks' && resObj.category !== selectedCategory) {
        setSelectedCategory('All');
      }
      if (onlyOfficial && !resObj.isOfficial) {
        setOnlyOfficial(false);
      }
      if (selectedTags.length > 0 && !selectedTags.every(t => resObj.tags.includes(t))) {
        setSelectedTags([]);
      }
      if (searchTerm && !resObj.title.toLowerCase().includes(searchTerm.toLowerCase()) && !resObj.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        setSearchTerm('');
      }
    }

    // Small delay to allow any filter resets to render
    setTimeout(() => {
      const el = document.getElementById(`resource-card-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedCardId(id);
        // Keep view count incremental
        const current = resourceStats[id] || { clicks: 0, views: 0 };
        saveStats({
          ...resourceStats,
          [id]: { ...current, views: current.views + 1 }
        });
        setTimeout(() => setHighlightedCardId(null), 2500);
      }
    }, 100);
  };

  const categories = ['All', 'Official', 'SDKs', 'Prompts', 'MCP', 'Tools', 'Frameworks'];

  // Filtered resources
  const filteredResources = resources.filter((r) => {
    const matchesSearch = 
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesOfficial = !onlyOfficial || r.isOfficial;
    const matchesTags = 
      selectedTags.length === 0 || 
      selectedTags.every((tag) => r.tags.includes(tag));

    return matchesSearch && matchesCategory && matchesOfficial && matchesTags;
  });

  // Calculate dynamic rankings
  const topTrendingList = [...resources]
    .map(r => ({
      ...r,
      clicks: resourceStats[r.id]?.clicks || 0,
      views: resourceStats[r.id]?.views || 0,
      score: trendingSortBy === 'clicks' 
        ? (resourceStats[r.id]?.clicks || 0) 
        : (resourceStats[r.id]?.views || 0)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Top 3 globally trending to place fire badges on cards
  const top3Ids = [...resources]
    .map(r => ({
      id: r.id,
      score: (resourceStats[r.id]?.clicks || 0) * 3 + (resourceStats[r.id]?.views || 0)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.id);

  return (
    <div id="resource-dashboard-view" className="space-y-6 animate-fade-in">
      {/* Search and Quick Metrics */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-500" />
            </span>
            <input
              type="text"
              placeholder="Search tools, prompts, SDKs, servers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all text-sm"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-zinc-950 shadow-md shadow-orange-500/10 font-bold'
                    : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Metadata check */}
        <div className="mt-4 pt-4 border-t border-zinc-800/60 flex flex-wrap gap-6 items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <label className="inline-flex items-center gap-2 text-zinc-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyOfficial}
                onChange={() => setOnlyOfficial(!onlyOfficial)}
                className="rounded text-orange-500 bg-zinc-950 border-zinc-850 focus:ring-offset-0 focus:ring-orange-500 w-4 h-4 cursor-pointer"
              />
              <span>Official Anthropic Resources Only</span>
            </label>

            {bookmarks.length > 0 && (
              <button
                onClick={() => setSelectedCategory(selectedCategory === 'Bookmarks' ? 'All' : 'Bookmarks')}
                className={`inline-flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
                  selectedCategory === 'Bookmarks' ? 'text-orange-400' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <BookmarkCheck className="w-4 h-4 text-orange-500" />
                <span>My Bookmarks ({bookmarks.length})</span>
              </button>
            )}
          </div>

          <div className="text-zinc-500 text-[11px] font-mono">
            Showing {filteredResources.length} of {resources.length} active resources
          </div>
        </div>

        {/* Selected Tags list */}
        {selectedTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 items-center pt-4 border-t border-zinc-800/40">
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-mono font-bold">Active tags:</span>
            {selectedTags.map(tag => (
              <span
                key={tag}
                onClick={() => toggleTag(tag)}
                className="bg-zinc-950 text-orange-400 border border-orange-500/30 text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer hover:bg-orange-500/10 transition-colors font-mono"
              >
                #{tag}
                <span className="text-zinc-600 hover:text-orange-400 font-bold ml-1">×</span>
              </span>
            ))}
            <button
              onClick={() => setSelectedTags([])}
              className="text-zinc-500 hover:text-zinc-300 text-xs underline font-medium cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main Content Layout splits grid and Trending Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Resource Grid: Left 3 columns on desktop */}
        <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {(selectedCategory === 'Bookmarks' ? resources.filter(r => bookmarks.includes(r.id)) : filteredResources).map((resource) => {
              const IconComponent = categoryIcons[resource.iconName] || Terminal;
              const isBookmarked = bookmarks.includes(resource.id);
              const isHighlighted = highlightedCardId === resource.id;

              return (
                <div
                  key={resource.id}
                  id={`resource-card-${resource.id}`}
                  className={`bg-zinc-900/50 border rounded-xl p-5 flex flex-col justify-between hover:border-orange-500/50 hover:shadow-2xl transition-all duration-500 group ${
                    isHighlighted 
                      ? 'border-orange-500 ring-2 ring-orange-500/30 scale-[1.03] shadow-lg shadow-orange-500/10 bg-zinc-900' 
                      : 'border-zinc-800'
                  }`}
                >
                  <div className="space-y-3.5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-2 bg-zinc-950 rounded-lg text-orange-500 border border-zinc-850 group-hover:border-orange-500/30 transition-all duration-300">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {/* Dynamic Upvote Button */}
                        <button
                          onClick={() => handleResourceClick(resource.id)}
                          className="p-1.5 bg-zinc-950/60 border border-zinc-850 hover:border-orange-500/30 rounded-md text-zinc-500 hover:text-orange-500 hover:bg-orange-500/5 transition-all cursor-pointer flex items-center gap-1 text-[10px] font-mono px-2"
                          title="Click to simulate view/upvote"
                        >
                          <Zap className="w-3 h-3 text-orange-500 fill-orange-500/20" />
                          <span>{resourceStats[resource.id]?.clicks || 0}</span>
                        </button>

                        <button
                          onClick={() => toggleBookmark(resource.id)}
                          className="p-1.5 bg-zinc-950/60 border border-zinc-850 rounded-md text-zinc-500 hover:text-orange-500 hover:border-orange-500/20 transition-all cursor-pointer"
                          title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                        >
                          {isBookmarked ? (
                            <Bookmark className="w-4 h-4 fill-orange-500 text-orange-500" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(resource.url, resource.id)}
                          className="p-1.5 bg-zinc-950/60 border border-zinc-850 rounded-md text-zinc-500 hover:text-orange-500 hover:border-orange-500/20 transition-all cursor-pointer"
                          title="Copy URL"
                        >
                          {copiedId === resource.id ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Title & Category info */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-950 text-zinc-400 uppercase tracking-wider">
                          {resource.category}
                        </span>
                        {resource.isOfficial && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase tracking-wider">
                            Official
                          </span>
                        )}
                        {/* Dynamic Hot/Trending Badge */}
                        {top3Ids.includes(resource.id) && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider flex items-center gap-0.5 animate-pulse">
                            <Flame className="w-2.5 h-2.5 fill-amber-500/20 text-amber-500" />
                            Trending
                          </span>
                        )}
                      </div>
                      <h3 className="text-zinc-100 font-semibold text-base tracking-tight group-hover:text-orange-400 transition-colors">
                        {resource.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">
                      {resource.description}
                    </p>
                  </div>

                  {/* Tags & Action Link */}
                  <div className="mt-5 pt-4 border-t border-zinc-800/40 space-y-3.5">
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.map((tag) => (
                        <span
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`text-[10px] px-2 py-0.5 rounded border font-mono transition-colors cursor-pointer ${
                            selectedTags.includes(tag)
                              ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                              : 'bg-zinc-950 text-zinc-500 border-zinc-850 hover:text-zinc-300'
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleResourceClick(resource.id)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 text-zinc-300 hover:text-orange-400 font-semibold text-xs rounded-lg hover:border-orange-500/20 transition-all shadow-inner"
                    >
                      <span>Access Resource</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}

            {filteredResources.length === 0 && selectedCategory !== 'Bookmarks' && (
              <div className="col-span-full py-16 bg-zinc-900/40 border border-zinc-800 rounded-xl text-center space-y-3">
                <div className="p-3 bg-zinc-950 inline-block rounded-full text-zinc-500">
                  <Search className="w-8 h-8" />
                </div>
                <h4 className="text-zinc-200 font-semibold text-lg">No resources found</h4>
                <p className="text-zinc-500 max-w-md mx-auto text-xs">
                  We couldn't find any curations matching "{searchTerm}" or your selected tags. Try adjusting your filters.
                </p>
              </div>
            )}

            {bookmarks.length === 0 && selectedCategory === 'Bookmarks' && (
              <div className="col-span-full py-16 bg-zinc-900/40 border border-zinc-800 rounded-xl text-center space-y-3">
                <div className="p-3 bg-zinc-950 inline-block rounded-full text-zinc-500">
                  <Bookmark className="w-8 h-8" />
                </div>
                <h4 className="text-zinc-200 font-semibold text-lg">No bookmarks saved yet</h4>
                <p className="text-zinc-500 max-w-sm mx-auto text-xs">
                  Bookmark resources by clicking the ribbon icon on any card to keep them handy here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Widget: Right 1 column on desktop */}
        <div className="lg:col-span-1 order-1 lg:order-2 space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                Trending (7 Days)
              </h3>
              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-850">
                Community favorites
              </span>
            </div>

            {/* Selector: Clicks vs Views */}
            <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-850">
              <button
                onClick={() => setTrendingSortBy('clicks')}
                className={`flex-1 text-center py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  trendingSortBy === 'clicks'
                    ? 'bg-orange-500 text-zinc-950 font-extrabold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Clicks ({trendingSortBy === 'clicks' ? 'Active' : 'Sort'})
              </button>
              <button
                onClick={() => setTrendingSortBy('views')}
                className={`flex-1 text-center py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  trendingSortBy === 'views'
                    ? 'bg-orange-500 text-zinc-950 font-extrabold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Views ({trendingSortBy === 'views' ? 'Active' : 'Sort'})
              </button>
            </div>

            {/* Trending Items List */}
            <div className="space-y-3">
              {topTrendingList.map((item, idx) => {
                const rankColor = 
                  idx === 0 ? 'bg-amber-500 text-zinc-950' : 
                  idx === 1 ? 'bg-zinc-300 text-zinc-950' : 
                  idx === 2 ? 'bg-amber-700 text-white' : 
                  'bg-zinc-800 text-zinc-400';

                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToAndHighlightCard(item.id)}
                    className="w-full text-left flex items-start gap-3 p-2 hover:bg-zinc-900/60 rounded-lg group/item transition-all border border-transparent hover:border-zinc-800/50 cursor-pointer"
                  >
                    <div className={`w-5 h-5 rounded-md font-mono text-xs font-bold flex items-center justify-center shrink-0 ${rankColor}`}>
                      {idx + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-xs text-zinc-200 group-hover/item:text-orange-400 transition-colors truncate">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider bg-zinc-950 px-1 py-0.2 rounded">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-mono text-orange-400">
                          {trendingSortBy === 'clicks' ? `${item.clicks} clicks` : `${item.views} views`}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Simulate wave button */}
            <div className="pt-3 border-t border-zinc-800/40">
              <button
                onClick={simulateTrafficWave}
                className={`w-full py-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-orange-400 font-mono text-[10px] uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  simulationFlash ? 'ring-2 ring-emerald-500/20 border-emerald-500 bg-emerald-500/5 text-emerald-400' : ''
                }`}
              >
                <TrendingUp className={`w-3.5 h-3.5 ${simulationFlash ? 'animate-bounce text-emerald-400' : ''}`} />
                <span>{simulationFlash ? 'Traffic Spike Simulated!' : 'Simulate Traffic Spike'}</span>
              </button>
              <p className="text-[9px] text-zinc-500 text-center mt-2 leading-relaxed">
                Recalculates top community activity over the last 7 days. Click cards or resources to watch rankings rise live!
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Curated Developer Setup Quick-Check */}
      <div className="bg-gradient-to-r from-orange-500/10 via-zinc-900 to-zinc-900 border border-zinc-800 rounded-xl p-6 mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5">
          <h3 className="text-zinc-100 font-semibold text-base flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-orange-500" />
            New to Claude Development?
          </h3>
          <p className="text-zinc-400 text-xs max-w-2xl leading-relaxed">
            The standard recommended stack is <strong className="text-zinc-200">Claude 3.5 Sonnet</strong>, paired with the official <strong className="text-zinc-200">TypeScript SDK</strong> or <strong className="text-zinc-200">Python SDK</strong>, and configured with <strong className="text-zinc-200">Model Context Protocol (MCP)</strong> to safely expose your local or cloud database schemas and tools to the assistant.
          </p>
        </div>
        <button
          onClick={() => {
            const el = document.getElementById('tab-prompt-workbench');
            if (el) el.click();
          }}
          className="bg-orange-500 hover:bg-orange-400 text-zinc-950 font-bold px-4 py-2 rounded-lg shadow-lg hover:shadow-orange-500/15 transition-all cursor-pointer text-xs shrink-0"
        >
          Generate Boilerplate Code
        </button>
      </div>
    </div>
  );
}

