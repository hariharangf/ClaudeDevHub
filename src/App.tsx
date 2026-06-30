import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import ModelMatrix from './components/ModelMatrix';
import McpGenerator from './components/McpGenerator';
import PromptWorkbench from './components/PromptWorkbench';
import DevAssistant from './components/DevAssistant';
import ProjectBootstrapper from './components/ProjectBootstrapper';
import { 
  BookOpen, 
  Cpu, 
  Server, 
  Lightbulb, 
  Bot, 
  Terminal, 
  Menu, 
  X, 
  ExternalLink,
  ChevronRight,
  Info,
  Layers,
  Heart,
  Briefcase
} from 'lucide-react';

type ActiveTab = 'resources' | 'models' | 'mcp' | 'prompts' | 'chat' | 'projects';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('resources');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // List of tabs for mapping
  const tabsList = [
    {
      id: 'resources' as ActiveTab,
      label: 'Curated Resources',
      desc: 'Awesome Claude list',
      icon: BookOpen,
      badge: 'Active'
    },
    {
      id: 'models' as ActiveTab,
      label: 'Model Intelligence Matrix',
      desc: 'Pricing & cost calculator',
      icon: Cpu,
    },
    {
      id: 'mcp' as ActiveTab,
      label: 'MCP Server Configurator',
      desc: 'Desktop JSON builder',
      icon: Server,
    },
    {
      id: 'prompts' as ActiveTab,
      label: 'Prompt Workbench',
      desc: 'XML tags & pre-filling',
      icon: Lightbulb,
    },
    {
      id: 'projects' as ActiveTab,
      label: 'Project Bootstrapper',
      desc: 'Doc & config bundler',
      icon: Briefcase,
      badge: 'Docs'
    },
    {
      id: 'chat' as ActiveTab,
      label: 'Claude-Dev AI Assistant',
      desc: 'Gemini logic specialist',
      icon: Bot,
      badge: 'AI'
    }
  ];

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-200 overflow-hidden font-sans">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex w-64 border-r border-zinc-900 bg-zinc-900/40 flex-col shrink-0">
        {/* Logo block */}
        <div className="p-6 flex items-center gap-3 border-b border-zinc-900/60">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-extrabold text-zinc-950 text-base tracking-tighter">
            C
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-white block">AwesomeClaude</span>
            <span className="text-[10px] text-zinc-500 font-mono tracking-wider font-semibold">DEVELOPER SUITE</span>
          </div>
        </div>
        
        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-2.5 pb-2.5 font-mono">
            Suite Modules
          </div>
          
          {tabsList.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900 text-white border border-zinc-800 shadow-md'
                    : 'text-zinc-400 hover:bg-zinc-900/40 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-orange-500' : 'text-zinc-500'}`} />
                  <div>
                    <span className="text-xs font-semibold block">{tab.label}</span>
                    <span className="text-[10px] text-zinc-500 mt-0.5 block">{tab.desc}</span>
                  </div>
                </div>
                {tab.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                    tab.badge === 'AI' 
                      ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' 
                      : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        
        {/* Community contributors block */}
        <div className="p-4 border-t border-zinc-900/80 bg-zinc-950/20">
          <div className="bg-zinc-900/30 border border-zinc-900 rounded-lg p-3.5 space-y-2.5">
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 font-bold">
              <Layers className="w-3.5 h-3.5 text-orange-500" />
              ECOSYSTEM STATS
            </div>
            <p className="text-[10px] text-zinc-500 leading-normal">
              Join 2,400+ developers contributing curated tools, prompt architectures, and Model Context Protocol servers.
            </p>
            <a
              href="https://github.com/highly-recommended/awesome-claude"
              target="_blank"
              rel="noreferrer"
              className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border border-zinc-750"
            >
              <span>Submit Curated Resource</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="h-16 border-b border-zinc-900 px-6 lg:px-8 flex items-center justify-between shrink-0 bg-zinc-950/40">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="space-y-0.5">
              <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                Developer Workspace
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-850 text-[10px] text-zinc-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Claude 3.5 Sonnet Live
                </span>
              </h1>
              <p className="text-[11px] text-zinc-500 hidden sm:block">
                Curated intelligence matrix & resources for the Anthropic developer ecosystem
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://awesomeclaude.ai"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-zinc-400 hover:text-orange-400 transition-colors flex items-center gap-1 font-semibold"
            >
              <span>awesomeclaude.ai</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </header>

        {/* Mobile Navigation Drawer Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-zinc-950/80 backdrop-blur-sm">
            <div className="w-72 bg-zinc-950 border-r border-zinc-900 p-5 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-zinc-950">
                      C
                    </div>
                    <span className="font-bold text-white text-sm">AwesomeClaude</span>
                  </div>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider px-2 font-mono">
                    Modules
                  </div>
                  {tabsList.map((tab) => {
                    const Icon = tab.icon;
                    const isSelected = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                          isSelected
                            ? 'bg-zinc-900 text-white'
                            : 'text-zinc-400 hover:bg-zinc-900/50'
                        }`}
                      >
                        <Icon className="w-4.5 h-4.5 text-orange-500" />
                        <span className="text-xs font-bold">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Submission and Credits */}
              <div className="space-y-4 pt-4 border-t border-zinc-900">
                <a
                  href="https://github.com/highly-recommended/awesome-claude"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 bg-orange-500 text-zinc-950 font-bold rounded text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Submit Curated Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          {activeTab === 'resources' && <Dashboard />}
          {activeTab === 'models' && <ModelMatrix />}
          {activeTab === 'mcp' && <McpGenerator />}
          {activeTab === 'prompts' && <PromptWorkbench />}
          {activeTab === 'chat' && <DevAssistant />}
          {activeTab === 'projects' && <ProjectBootstrapper />}
        </div>

        {/* Footer */}
        <footer className="h-12 border-t border-zinc-900 px-6 lg:px-8 flex items-center justify-between text-[11px] text-zinc-500 bg-zinc-950/60 shrink-0">
          <div className="flex gap-6 font-mono">
            <span>Resources: 458 curated</span>
            <span>Ecosystem version: MCP v1.0.4</span>
            <span className="hidden sm:inline">Active Dev Contributors: 142</span>
          </div>
          <div className="flex gap-1 items-center select-none font-mono">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse mx-0.5" />
            <span>for Claude Developers</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
