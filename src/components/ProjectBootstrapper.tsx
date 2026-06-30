import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  FileText, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Briefcase, 
  Code, 
  Sparkles, 
  Settings, 
  Terminal, 
  BookOpen, 
  Cpu, 
  Layers, 
  Flame, 
  Info,
  Shield,
  FileCode,
  Eye,
  ChevronRight
} from 'lucide-react';

interface ProjectServer {
  id: string;
  name: string;
  description: string;
}

interface BootstrappedProject {
  id: string;
  name: string;
  description: string;
  targetModel: string;
  workspacePath: string;
  selectedServers: string[];
  customNotes?: string;
  createdAt: string;
}

const MCP_AVAILABLE_SERVERS: ProjectServer[] = [
  { id: 'git', name: 'Git Server', description: 'Allows Claude to check status, view diffs, and create commits/branches.' },
  { id: 'filesystem', name: 'Filesystem Server', description: 'Enables safe read/write access to specified local directories.' },
  { id: 'postgres', name: 'Postgres Database', description: 'Connects Claude to query, schema-inspect, and manage PostgreSQL databases.' },
  { id: 'brave-search', name: 'Brave Web Search', description: 'Performs live internet web searches and extracts page contents.' },
  { id: 'puppeteer', name: 'Puppeteer Browser', description: 'Automates browser operations, captures screenshots, and inspects web pages.' },
  { id: 'memory', name: 'Memory Graph', description: 'Maintains persistent knowledge graphs and semantic memory across sessions.' },
];

const DEFAULT_PROJECTS: BootstrappedProject[] = [
  {
    id: 'proj-git-copilot',
    name: 'Local Git Co-Author',
    description: 'A developer workspace designed to co-author codebase changes, write commit messages, and manage branches locally.',
    targetModel: 'Claude 3.5 Sonnet',
    workspacePath: '/Users/developer/code/my-app',
    selectedServers: ['git', 'filesystem'],
    customNotes: 'Ensure your local SSH keys are fully authenticated before running git commits.',
    createdAt: '2026-06-29T10:00:00.000Z'
  },
  {
    id: 'proj-web-analyst',
    name: 'Web Research Analyst',
    description: 'Automates competitive market intelligence gathering, scrapes modern SPAs, and compiles reports.',
    targetModel: 'Claude 3.5 Haiku',
    workspacePath: '/Users/developer/research/analytics',
    selectedServers: ['brave-search', 'puppeteer'],
    customNotes: 'Set BRAVE_API_KEY in your local environment.',
    createdAt: '2026-06-29T14:30:00.000Z'
  }
];

export default function ProjectBootstrapper() {
  const [projects, setProjects] = useState<BootstrappedProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-git-copilot');
  const [activeFile, setActiveFile] = useState<'readme' | 'config' | 'env'>('readme');
  const [viewMode, setViewMode] = useState<'preview' | 'source'>('preview');

  // Form states
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [targetModel, setTargetModel] = useState('Claude 3.5 Sonnet');
  const [workspacePath, setWorkspacePath] = useState('/Users/developer/projects/my-new-app');
  const [selectedServers, setSelectedServers] = useState<string[]>(['filesystem']);
  const [customNotes, setCustomNotes] = useState('');
  
  // Feedback states
  const [copiedText, setCopiedText] = useState(false);
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  // Initialize
  useEffect(() => {
    const saved = localStorage.getItem('claude_bootstrapped_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setProjects(parsed);
          setSelectedProjectId(parsed[0].id);
        } else {
          setProjects(DEFAULT_PROJECTS);
          setSelectedProjectId(DEFAULT_PROJECTS[0].id);
        }
      } catch (e) {
        setProjects(DEFAULT_PROJECTS);
      }
    } else {
      setProjects(DEFAULT_PROJECTS);
      localStorage.setItem('claude_bootstrapped_projects', JSON.stringify(DEFAULT_PROJECTS));
    }
  }, []);

  const saveProjectsList = (updated: BootstrappedProject[]) => {
    setProjects(updated);
    localStorage.setItem('claude_bootstrapped_projects', JSON.stringify(updated));
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    const newProject: BootstrappedProject = {
      id: `proj-${Date.now()}`,
      name: projectName,
      description: projectDesc || 'A custom development workspace configured with custom Claude parameters.',
      targetModel,
      workspacePath: workspacePath || '/Users/developer/workspace',
      selectedServers,
      customNotes,
      createdAt: new Date().toISOString()
    };

    const updated = [newProject, ...projects];
    saveProjectsList(updated);
    setSelectedProjectId(newProject.id);
    setActiveFile('readme');
    setViewMode('preview');

    // Reset Form
    setProjectName('');
    setProjectDesc('');
    setTargetModel('Claude 3.5 Sonnet');
    setWorkspacePath('/Users/developer/projects/my-new-app');
    setSelectedServers(['filesystem']);
    setCustomNotes('');

    // Toast
    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 3000);
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = projects.filter(p => p.id !== id);
    saveProjectsList(filtered);
    if (selectedProjectId === id && filtered.length > 0) {
      setSelectedProjectId(filtered[0].id);
    }
  };

  const toggleServerSelection = (id: string) => {
    if (selectedServers.includes(id)) {
      setSelectedServers(selectedServers.filter(s => s !== id));
    } else {
      setSelectedServers([...selectedServers, id]);
    }
  };

  const currentProject = projects.find(p => p.id === selectedProjectId) || DEFAULT_PROJECTS[0];

  // Config generator
  const generateConfigJson = (proj: BootstrappedProject) => {
    const serversMap: Record<string, any> = {};

    proj.selectedServers.forEach(server => {
      if (server === 'filesystem') {
        serversMap['filesystem'] = {
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-filesystem', proj.workspacePath]
        };
      } else if (server === 'git') {
        serversMap['git'] = {
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-git', proj.workspacePath]
        };
      } else if (server === 'postgres') {
        serversMap['postgres'] = {
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-postgres'],
          env: {
            DATABASE_URL: 'postgresql://username:password@localhost:5432/my_database'
          }
        };
      } else if (server === 'brave-search') {
        serversMap['brave-search'] = {
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-brave-search'],
          env: {
            BRAVE_API_KEY: 'YOUR_BRAVE_API_KEY_HERE'
          }
        };
      } else if (server === 'puppeteer') {
        serversMap['puppeteer'] = {
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-puppeteer']
        };
      } else if (server === 'memory') {
        serversMap['memory'] = {
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-memory']
        };
      }
    });

    return JSON.stringify({ mcpServers: serversMap }, null, 2);
  };

  // Environmental Config Generator
  const generateEnvExample = (proj: BootstrappedProject) => {
    let envContent = `# Environment settings for Project: ${proj.name}\n`;
    envContent += `# Workspace: ${proj.workspacePath}\n\n`;

    if (proj.selectedServers.includes('postgres')) {
      envContent += `# Database credentials for Postgres Server\n`;
      envContent += `DATABASE_URL=postgresql://username:password@localhost:5432/my_database\n\n`;
    }
    if (proj.selectedServers.includes('brave-search')) {
      envContent += `# Secure Web Search credentials from Brave Developer Portal\n`;
      envContent += `BRAVE_API_KEY=YOUR_SECURE_API_KEY_VAL\n\n`;
    }
    envContent += `# General configurations\n`;
    envContent += `CLAUDE_WORKSPACE_ENV=development\n`;
    envContent += `RECOMMENDED_MODEL=${proj.targetModel.replace(/\s+/g, '_').toUpperCase()}\n`;

    return envContent;
  };

  // Mandatory Markdown README generator
  const generateReadmeMarkdown = (proj: BootstrappedProject) => {
    const formattedDate = new Date(proj.createdAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let md = `# ${proj.name}\n\n`;
    md += `> **Ecosystem Workspace Configuration** • Generated via AwesomeClaude Suite on ${formattedDate}\n\n`;
    md += `## 📝 Overview\n\n`;
    md += `${proj.description}\n\n`;
    md += `This specialized workspace is pre-compiled to align with **${proj.targetModel}** and leverages **${proj.selectedServers.length} active Model Context Protocol (MCP)** tool connections.\n\n`;

    md += `## 🤖 AI Profile & Targeting\n\n`;
    md += `| Attribute | Workspace Alignment |\n`;
    md += `| :--- | :--- |\n`;
    md += `| **Primary Model** | \`${proj.targetModel}\` |\n`;
    md += `| **Recommended Use** | Advanced semantic reasoning & context-rich workflows |\n`;
    md += `| **Root Directory** | \`${proj.workspacePath}\` |\n`;
    md += `| **Status** | Bootstrapped & Secured |\n\n`;

    md += `## 🔌 Active MCP Toolsets\n\n`;
    md += `This workspace binds the following servers directly into Claude Desktop. When configuring your agent, ensure these commands are accessible:\n\n`;

    proj.selectedServers.forEach(srv => {
      const info = MCP_AVAILABLE_SERVERS.find(s => s.id === srv);
      if (info) {
        md += `### 🔹 ${info.name}\n`;
        md += `- **Purpose:** ${info.description}\n`;
        if (srv === 'filesystem') {
          md += `- **Permission Guard:** Read/write inside directory path: \`${proj.workspacePath}\`\n`;
        } else if (srv === 'git') {
          md += `- **Context Anchor:** Live repo state tracking inside: \`${proj.workspacePath}\`\n`;
        } else if (srv === 'postgres') {
          md += `- **Dependency:** Local Postgres Instance. Requires \`DATABASE_URL\` environmental variable.\n`;
        } else if (srv === 'brave-search') {
          md += `- **Dependency:** Active API Token from Brave Search Developer Hub.\n`;
        }
        md += `\n`;
      }
    });

    md += `## ⚙️ Installation & Workspace Integration\n\n`;
    md += `### Step 1: Establish Claude Config\n`;
    md += `Copy the bootstrapped \`claude_desktop_config.json\` file generated for this project and insert it into your primary system configuration path:\n\n`;
    md += `* **macOS:** \`~/Library/Application Support/Claude/claude_desktop_config.json\`\n`;
    md += `* **Windows:** \`\\%APPDATA\\%\\Claude\\claude_desktop_config.json\`\n\n`;

    md += `### Step 2: Validate Directory Setup\n`;
    md += `Create this project directory locally if it doesn't already exist:\n`;
    md += `\`\`\`bash\n`;
    md += `mkdir -p ${proj.workspacePath}\n`;
    md += `cd ${proj.workspacePath}\n`;
    md += `\`\`\`\n\n`;

    if (proj.customNotes) {
      md += `## 💡 Workspace Notes\n`;
      md += `${proj.customNotes}\n\n`;
    }

    md += `## 🔒 Security & Operational Best Practices\n\n`;
    md += `1. **Token Protection:** Never commit actual API keys or \`DATABASE_URL\` details directly into shared GitHub repositories. Utilize local environmental managers instead.\n`;
    md += `2. **Scoped Directories:** The Filesystem server restricts tool accesses safely. Never configure the directory path argument to the absolute root \`/\` as this would grant broad capabilities.\n`;
    md += `3. **Terminal Verification:** Always check that any required CLI commands (such as \`npx\`, \`git\`) are properly declared in your system's global \`PATH\` parameters.\n\n`;
    
    md += `--- \n`;
    md += `*Self-documenting developer package automatically bootstrapped via the AwesomeClaude Developer Portal.*`;

    return md;
  };

  const getFileContents = () => {
    if (activeFile === 'readme') return generateReadmeMarkdown(currentProject);
    if (activeFile === 'config') return generateConfigJson(currentProject);
    return generateEnvExample(currentProject);
  };

  const getFilename = () => {
    if (activeFile === 'readme') return 'README.md';
    if (activeFile === 'config') return 'claude_desktop_config.json';
    return '.env.example';
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getFileContents());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const triggerDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([getFileContents()], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = getFilename();
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Simple Markdown Renderer
  const renderMarkdownPreview = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-xl font-bold text-white border-b border-zinc-800 pb-2 mb-4 mt-6">{line.replace('# ', '')}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-lg font-bold text-orange-400 mt-5 mb-3 flex items-center gap-1">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-sm font-bold text-zinc-200 mt-4 mb-2">{line.replace('### ', '')}</h3>;
      }
      // Blockquotes
      if (line.startsWith('> ')) {
        return <blockquote key={idx} className="border-l-4 border-orange-500 bg-zinc-900/30 px-3.5 py-2.5 rounded text-xs text-zinc-400 italic my-3">{line.replace('> ', '')}</blockquote>;
      }
      // Code blocks start/end
      if (line.startsWith('```')) {
        return null; // Handle simply inside standard blocks or custom styling
      }
      // Bullet list items
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const cleaned = line.substring(2);
        return (
          <li key={idx} className="text-xs text-zinc-400 ml-4 list-disc leading-relaxed my-1">
            {cleaned.includes('`') ? renderInlineCode(cleaned) : cleaned}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        const cleaned = line.replace(/^\d+\.\s/, '');
        return (
          <li key={idx} className="text-xs text-zinc-400 ml-4 list-decimal leading-relaxed my-1">
            {cleaned.includes('`') ? renderInlineCode(cleaned) : cleaned}
          </li>
        );
      }
      // Tables
      if (line.startsWith('|') && !line.includes('---')) {
        const cells = line.split('|').map(c => c.trim()).filter(c => c !== '');
        return (
          <div key={idx} className="grid grid-cols-2 bg-zinc-950 border border-zinc-900 rounded p-2 text-xs font-mono my-1">
            {cells.map((cell, cidx) => (
              <span key={cidx} className={cidx % 2 === 0 ? "text-zinc-500 font-bold" : "text-zinc-300"}>
                {cell.replace(/`/g, '')}
              </span>
            ))}
          </div>
        );
      }
      if (line.trim() === '') return <div key={idx} className="h-2" />;

      // Fallback standard text
      return (
        <p key={idx} className="text-xs text-zinc-400 leading-relaxed my-1.5">
          {line.includes('`') ? renderInlineCode(line) : line}
        </p>
      );
    });
  };

  const renderInlineCode = (text: string) => {
    const parts = text.split('`');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <code key={index} className="px-1.5 py-0.5 bg-zinc-950 rounded text-[11px] font-mono text-orange-400 border border-zinc-900">{part}</code>;
      }
      return part;
    });
  };

  return (
    <div id="project-bootstrapper-view" className="space-y-8 animate-fade-in relative">
      {/* Toast Alert */}
      {isSuccessToast && (
        <div className="fixed top-20 right-6 bg-emerald-500 text-zinc-950 font-bold text-xs px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 z-50 animate-bounce">
          <Check className="w-4 h-4" />
          <span>New Workspace Project bootstrapped!</span>
        </div>
      )}

      {/* Intro header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-orange-500" />
            Project Workspace Bootstrapper
          </h2>
          <p className="text-zinc-400 text-sm">
            Bundle MCP servers, custom profiles, and model specifications. Generates a **mandatory self-documenting Markdown README** and system configs for each project.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-850 font-mono text-[10px] text-zinc-400">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
          <span>Mandatory Docs Mode Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side (Col 1-4 on Desktop): Projects list & Form */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Bootstrapped Projects */}
          <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-4 space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-orange-500" />
              Active Projects ({projects.length})
            </h3>
            
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {projects.map((proj) => {
                const isSelected = proj.id === selectedProjectId;
                return (
                  <div
                    key={proj.id}
                    onClick={() => {
                      setSelectedProjectId(proj.id);
                      setActiveFile('readme');
                    }}
                    className={`w-full text-left p-3 rounded-lg border flex items-center justify-between transition-all cursor-pointer group ${
                      isSelected 
                        ? 'bg-zinc-900 border-orange-500/30 ring-1 ring-orange-500/10' 
                        : 'bg-zinc-950/40 border-zinc-900 hover:bg-zinc-900/30 hover:border-zinc-850'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-zinc-300 group-hover:text-orange-400'}`}>
                        {proj.name}
                      </h4>
                      <p className="text-[10px] text-zinc-500 truncate mt-0.5">{proj.description}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[9px] font-mono font-semibold px-1 py-0.2 bg-zinc-950 text-orange-400 rounded">
                          {proj.selectedServers.length} MCPs
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">
                          {proj.targetModel.replace('Claude ', '')}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => handleDeleteProject(proj.id, e)}
                      className="p-1 text-zinc-600 hover:text-red-400 transition-colors cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form to create new project */}
          <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-orange-500" />
              Bootstrap New Project
            </h3>

            <form onSubmit={handleCreateProject} className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 font-mono uppercase">Project Name *</label>
                <input 
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Sales Analysis Agent"
                  className="w-full bg-zinc-950 border border-zinc-850 rounded px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-orange-500 placeholder-zinc-600"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 font-mono uppercase">Description</label>
                <textarea 
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="Summarize the project capabilities..."
                  rows={2}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-orange-500 placeholder-zinc-600 resize-none"
                />
              </div>

              {/* Target Model Selection */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 font-mono uppercase">Target Claude Model</label>
                <select
                  value={targetModel}
                  onChange={(e) => setTargetModel(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded px-2 py-1.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Best Code/Reasoning)</option>
                  <option value="Claude 3.5 Haiku">Claude 3.5 Haiku (Ultra Fast & Light)</option>
                  <option value="Claude 3 Opus">Claude 3 Opus (Deep Philosophical Analyst)</option>
                </select>
              </div>

              {/* Workspace Directory */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 font-mono uppercase">Local Workspace Directory</label>
                <input 
                  type="text"
                  value={workspacePath}
                  onChange={(e) => setWorkspacePath(e.target.value)}
                  placeholder="/Users/developer/code/workspace"
                  className="w-full bg-zinc-950 border border-zinc-850 rounded px-3 py-1.5 text-xs text-zinc-100 font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              {/* Select MCPs */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 font-mono uppercase block">Select Workspace MCPs</label>
                <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
                  {MCP_AVAILABLE_SERVERS.map((srv) => {
                    const checked = selectedServers.includes(srv.id);
                    return (
                      <button
                        type="button"
                        key={srv.id}
                        onClick={() => toggleServerSelection(srv.id)}
                        className={`text-left p-1.5 rounded border text-[10px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                          checked 
                            ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' 
                            : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${checked ? 'bg-orange-400' : 'bg-zinc-700'}`}></span>
                        <span>{srv.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom notes */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 font-mono uppercase">Custom Notes / Warnings</label>
                <input 
                  type="text"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g. Ensure SSH access is open"
                  className="w-full bg-zinc-950 border border-zinc-850 rounded px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-2 bg-orange-500 hover:bg-orange-400 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Compile Workspace Package</span>
              </button>
            </form>
          </div>

        </div>

        {/* Right Side (Col 5-12 on Desktop): Interactive Workspace File Explorer & Output Visualizer */}
        <div className="lg:col-span-8 flex flex-col md:flex-row gap-6">
          
          {/* Virtual Workspace Directory File Tree */}
          <div className="w-full md:w-56 bg-zinc-900/30 border border-zinc-900 rounded-xl p-4 space-y-4 shrink-0">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Folder className="w-4 h-4 text-orange-500" />
                Workspace Files
              </h3>
              <p className="text-[10px] text-zinc-500">Virtual compilation view</p>
            </div>

            <div className="space-y-1 text-xs">
              <div className="p-1 text-zinc-500 flex items-center gap-1.5 font-mono text-[10px]">
                <span>📁 workspace-root</span>
              </div>
              
              <div className="space-y-1 pl-3 font-mono">
                {/* README.md (Highlighted and Mandatory) */}
                <button
                  onClick={() => setActiveFile('readme')}
                  className={`w-full text-left p-1.5 rounded flex items-center justify-between cursor-pointer ${
                    activeFile === 'readme' 
                      ? 'bg-zinc-900 text-orange-400 font-bold' 
                      : 'text-zinc-400 hover:bg-zinc-950'
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <FileText className={`w-3.5 h-3.5 ${activeFile === 'readme' ? 'text-orange-500' : 'text-zinc-500'}`} />
                    <span>README.md</span>
                  </span>
                  <span className="text-[8px] font-sans font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 px-1 py-0.2 rounded shrink-0 scale-90">
                    Mandatory
                  </span>
                </button>

                {/* claude_desktop_config.json */}
                <button
                  onClick={() => setActiveFile('config')}
                  className={`w-full text-left p-1.5 rounded flex items-center gap-1.5 cursor-pointer ${
                    activeFile === 'config' 
                      ? 'bg-zinc-900 text-white font-bold' 
                      : 'text-zinc-400 hover:bg-zinc-950'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="truncate">claude_desktop_config.json</span>
                </button>

                {/* .env.example */}
                <button
                  onClick={() => setActiveFile('env')}
                  className={`w-full text-left p-1.5 rounded flex items-center gap-1.5 cursor-pointer ${
                    activeFile === 'env' 
                      ? 'bg-zinc-900 text-white font-bold' 
                      : 'text-zinc-400 hover:bg-zinc-950'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="truncate">.env.example</span>
                </button>
              </div>
            </div>

            {/* Quick security stats card */}
            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-900 space-y-2 mt-4">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 font-bold">
                <Shield className="w-3.5 h-3.5 text-orange-500" />
                SECURITY GUARD
              </div>
              <p className="text-[9px] text-zinc-500 leading-relaxed">
                Automatically pre-scans workspace bindings for credentials exposure and checks system PATH environments before deployment.
              </p>
            </div>
          </div>

          {/* Code Viewer / Rendered Content Area */}
          <div className="flex-1 bg-zinc-900/30 border border-zinc-900 rounded-xl flex flex-col justify-between overflow-hidden shadow-xl">
            
            {/* Toolbar Header */}
            <div className="bg-zinc-950 p-4 border-b border-zinc-900/80 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-white bg-zinc-900 border border-zinc-850 px-2.5 py-1 rounded">
                  {getFilename()}
                </span>
                
                {/* Rendered Preview/Source Toggle only on README.md */}
                {activeFile === 'readme' && (
                  <div className="flex bg-zinc-900 p-0.5 rounded border border-zinc-850 scale-95">
                    <button
                      onClick={() => setViewMode('preview')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        viewMode === 'preview' ? 'bg-orange-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Rendered
                    </button>
                    <button
                      onClick={() => setViewMode('source')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        viewMode === 'source' ? 'bg-orange-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Raw Source
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={copyToClipboard}
                  className="p-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white rounded transition-colors cursor-pointer"
                  title="Copy to clipboard"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={triggerDownload}
                  className="p-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white rounded transition-colors cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Viewer Pane Content */}
            <div className="p-5 font-mono text-xs text-zinc-300 flex-1 overflow-y-auto max-h-[460px] min-h-[300px]">
              {activeFile === 'readme' && viewMode === 'preview' ? (
                <div className="font-sans space-y-4 text-zinc-300">
                  {renderMarkdownPreview(generateReadmeMarkdown(currentProject))}
                </div>
              ) : (
                <pre className="whitespace-pre-wrap break-all leading-relaxed bg-zinc-950/40 p-4 rounded-lg border border-zinc-950/60 font-mono text-[11px] select-all">
                  {getFileContents()}
                </pre>
              )}
            </div>

            {/* Path status Footer */}
            <div className="bg-zinc-950/60 p-3 px-5 border-t border-zinc-900 text-[10px] text-zinc-500 font-mono flex items-center justify-between">
              <span>Target Workspace Path: {currentProject.workspacePath}</span>
              <span>Model Context Protocol Standard compatible</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
