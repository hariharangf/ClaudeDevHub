import React, { useState } from 'react';
import { MCP_SERVERS } from '../data/resources';
import { McpServer } from '../types';
import { 
  Server, 
  Terminal, 
  Copy, 
  Check, 
  HelpCircle, 
  ExternalLink, 
  RefreshCw, 
  Info,
  ChevronRight,
  Settings,
  Plus,
  Trash2
} from 'lucide-react';

export default function McpGenerator() {
  const [servers] = useState<McpServer[]>(MCP_SERVERS);
  const [enabledServerIds, setEnabledServerIds] = useState<string[]>(['mcp-server-git']);
  const [envValues, setEnvValues] = useState<Record<string, string>>({
    'GITHUB_PERSONAL_ACCESS_TOKEN': 'ghp_exampleToken1234567890abcdefghijklmnopqrstuvwxyz',
    'POSTGRES_URL': 'postgresql://postgres:password@localhost:5432/my_app_database'
  });
  const [customArgs, setCustomArgs] = useState<Record<string, string>>({
    'mcp-server-filesystem': '/Users/username/Projects/my-app'
  });
  const [copied, setCopied] = useState(false);

  const toggleServer = (id: string) => {
    if (enabledServerIds.includes(id)) {
      setEnabledServerIds(enabledServerIds.filter(s => s !== id));
    } else {
      setEnabledServerIds([...enabledServerIds, id]);
    }
  };

  const handleEnvChange = (key: string, value: string) => {
    setEnvValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleArgChange = (serverId: string, value: string) => {
    setCustomArgs(prev => ({
      ...prev,
      [serverId]: value
    }));
  };

  // Generate the actual claude_desktop_config.json structure
  const generateConfigJson = () => {
    const mcpServersRecord: Record<string, any> = {};

    servers.forEach((server) => {
      if (enabledServerIds.includes(server.id)) {
        const serverKey = server.id.replace('mcp-server-', '');
        
        // Build arguments
        let finalArgs = [...(server.args || [])];
        if (server.id === 'mcp-server-filesystem' && customArgs[server.id]) {
          // Replace directory path in the array if it was present
          finalArgs = ['-y', '@modelcontextprotocol/server-filesystem', customArgs[server.id]];
        }

        // Build environment variables
        const envRecord: Record<string, string> = {};
        server.envVars.forEach((ev) => {
          envRecord[ev.name] = envValues[ev.name] || ev.defaultValue || '';
        });

        mcpServersRecord[serverKey] = {
          command: server.command,
          args: finalArgs,
          ...(Object.keys(envRecord).length > 0 ? { env: envRecord } : {})
        };
      }
    });

    const fullConfig = {
      mcpServers: mcpServersRecord
    };

    return JSON.stringify(fullConfig, null, 2);
  };

  const copyConfigToClipboard = () => {
    navigator.clipboard.writeText(generateConfigJson());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="mcp-generator-view" className="space-y-8 animate-fade-in">
      {/* Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-orange-500" />
            Model Context Protocol (MCP) Server Configurator
          </h2>
          <p className="text-zinc-400 text-sm">
            Configure secure tool integrations for Claude Desktop. Fill in server credentials to live-generate your custom JSON configuration file.
          </p>
        </div>
        <a 
          href="https://modelcontextprotocol.org/docs/concepts/architecture" 
          target="_blank" 
          rel="noreferrer"
          className="text-xs bg-zinc-800 text-zinc-300 border border-zinc-700 hover:text-orange-400 hover:border-orange-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0 font-medium transition-colors cursor-pointer"
        >
          <span>MCP Architecture Spec</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Server selections & credentials */}
        <div className="space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-zinc-800/60">
            <Settings className="w-4 h-4 text-orange-500" />
            1. Select & Configure Servers
          </h3>

          <div className="space-y-4">
            {servers.map((server) => {
              const isEnabled = enabledServerIds.includes(server.id);
              return (
                <div 
                  key={server.id} 
                  className={`border rounded-xl p-4 transition-all ${
                    isEnabled 
                      ? 'bg-zinc-900/60 border-orange-500/30' 
                      : 'bg-zinc-900/20 border-zinc-800/60 hover:bg-zinc-900/30'
                  }`}
                >
                  {/* Selector Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => toggleServer(server.id)}
                        className="rounded text-orange-500 bg-zinc-950 border-zinc-800 focus:ring-offset-0 focus:ring-orange-500 w-4 h-4 cursor-pointer"
                        id={`check-${server.id}`}
                      />
                      <div>
                        <label 
                          htmlFor={`check-${server.id}`}
                          className="font-bold text-sm text-zinc-100 hover:text-orange-400 transition-colors cursor-pointer block"
                        >
                          {server.name}
                        </label>
                        <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{server.description}</p>
                      </div>
                    </div>
                    
                    <a 
                      href={server.githubUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-zinc-500 hover:text-zinc-300 transition-colors"
                      title="View GitHub Readme"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Credentials / Config inputs when enabled */}
                  {isEnabled && (
                    <div className="mt-4 pt-3 border-t border-zinc-800/50 space-y-3 pl-7">
                      
                      {/* Special input case for filesystem path args */}
                      {server.id === 'mcp-server-filesystem' && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono font-bold text-zinc-400 block flex items-center justify-between">
                            <span>FILESYSTEM PATH ARGUMENT</span>
                            <span className="text-[10px] text-orange-400">Required Directory</span>
                          </label>
                          <input 
                            type="text"
                            value={customArgs[server.id] || ''}
                            onChange={(e) => handleArgChange(server.id, e.target.value)}
                            placeholder="/Users/yourname/workspace/project-folder"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                        </div>
                      )}

                      {/* Dynamic Environment variables */}
                      {server.envVars.map((ev) => (
                        <div key={ev.name} className="space-y-1.5">
                          <label className="text-xs font-mono font-bold text-zinc-400 block flex items-center justify-between">
                            <span>{ev.name}</span>
                            <span className={`text-[10px] ${ev.required ? 'text-red-400' : 'text-zinc-500'}`}>
                              {ev.required ? 'Required API Key' : 'Optional'}
                            </span>
                          </label>
                          <p className="text-[11px] text-zinc-500 italic mt-0.5">{ev.description}</p>
                          <input 
                            type="password"
                            value={envValues[ev.name] || ''}
                            onChange={(e) => handleEnvChange(ev.name, e.target.value)}
                            placeholder={ev.required ? 'Paste API key or credential here' : ev.defaultValue || ''}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                        </div>
                      ))}

                      {server.envVars.length === 0 && server.id !== 'mcp-server-filesystem' && (
                        <p className="text-[11px] text-emerald-400 font-mono bg-zinc-950/40 px-2 py-1 rounded flex items-center gap-1">
                          <Info className="w-3.5 h-3.5" />
                          <span>No environment variables or special credentials required for this server!</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Generated JSON Preview & Installation Instructions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-orange-500" />
              2. Config file generator
            </h3>
            
            <button 
              onClick={copyConfigToClipboard}
              className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-xs flex items-center gap-1 cursor-pointer transition-colors border border-zinc-700"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Configuration</span>
                </>
              )}
            </button>
          </div>

          {/* Code Viewer block */}
          <div className="relative">
            <pre className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-5 font-mono text-xs text-zinc-300 leading-relaxed overflow-x-auto h-[320px] shadow-inner select-all">
              {generateConfigJson()}
            </pre>
            <div className="absolute top-3 right-3 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded font-mono text-[9px] text-zinc-500">
              claude_desktop_config.json
            </div>
          </div>

          {/* Quick instructions setup block */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-orange-500 animate-spin-slow" />
              How to Save and Load this Config
            </h4>

            <div className="space-y-3 text-xs text-zinc-400">
              <div className="space-y-1">
                <span className="font-bold text-zinc-300 block">Step A: Locate configuration file</span>
                <p className="leading-relaxed">
                  Open Claude Desktop config by copying this generated configuration, and replacing the contents inside your local configuration folder:
                </p>
                <div className="bg-zinc-950 px-2.5 py-1.5 rounded font-mono text-zinc-500 mt-1 select-all border border-zinc-900 flex flex-col gap-1.5">
                  <div>
                    <span className="text-zinc-600 mr-2">macOS:</span>
                    <span>~/Library/Application Support/Claude/claude_desktop_config.json</span>
                  </div>
                  <div>
                    <span className="text-zinc-600 mr-2">Windows:</span>
                    <span>%APPDATA%\Claude\claude_desktop_config.json</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <span className="font-bold text-zinc-300 block">Step B: Save and Restart</span>
                <p className="leading-relaxed">
                  Save the file and <strong className="text-zinc-200">completely quit Claude Desktop</strong>, then launch it again. You will see a small tool/hammer icon under Claude's input field indicating your tools are active!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
