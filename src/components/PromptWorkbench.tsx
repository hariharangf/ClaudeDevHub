import React, { useState } from 'react';
import { 
  FileText, 
  Lightbulb, 
  Copy, 
  Check, 
  Code, 
  ArrowRight, 
  Sparkles, 
  Plus, 
  RefreshCw,
  Eye
} from 'lucide-react';

interface PromptPreset {
  id: string;
  name: string;
  category: string;
  systemInstructions: string;
  userPrompt: string;
}

const PRESETS: PromptPreset[] = [
  {
    id: 'coding-agent',
    name: 'Advanced Coding & Engineering Agent',
    category: 'Software Engineering',
    systemInstructions: `<system_instructions>
You are an expert full-stack senior software engineer.
Follow these coding rules:
1. Analyze the context completely and plan your changes in a <thinking> block before writing any code.
2. Write clean, modular, and type-safe code in TypeScript or Python.
3. Make sure to structure any explanations clearly. Use bullet points or code blocks where appropriate.
</system_instructions>`,
    userPrompt: `<context>
The current system operates on a React frontend with a Node/Express backend.
Here is the schema for our user accounts:
\`\`\`sql
CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`
</context>

<task>
Generate a Node.js repository service file for writing accounts and handling duplicates gracefully.
</task>`
  },
  {
    id: 'json-extractor',
    name: 'Structured JSON Extraction with Schema',
    category: 'Data Engineering',
    systemInstructions: `<system_instructions>
You are an advanced data extraction assistant.
Your goal is to parse raw user documents or text transcripts and return valid JSON conforming to the requested schema.
Rules:
- Never include conversational filler or markdown code block surrounds (like \`\`\`json) unless explicitly asked.
- Return ONLY valid JSON.
</system_instructions>`,
    userPrompt: `<json_schema>
{
  "company": "string",
  "founded_year": "number",
  "locations": "array of strings",
  "executives": [
    {
      "name": "string",
      "role": "string"
    }
  ]
}
</json_schema>

<raw_text>
Acme Corp was started back in 2012 by Jane Doe (CEO) and John Smith (CTO) in Seattle. Over the years they expanded their operations to offices in San Francisco and New York.
</raw_text>`
  },
  {
    id: 'xml-prefill',
    name: 'Prompt Pre-filling (Steer Output Structure)',
    category: 'Advanced Alignment',
    systemInstructions: `<system_instructions>
You are a translation and language alignment specialist.
You will translate user texts into elegant French and explain the cultural nuances.
Always output your translation inside <translation> tags and the cultural explanation inside <nuance> tags.
</system_instructions>`,
    userPrompt: `<text_to_translate>
A rolling stone gathers no moss.
</text_to_translate>

Please proceed with your translation.
I will pre-fill the start of your response so you remain aligned:
<translation>`
  }
];

export default function PromptWorkbench() {
  const [presets] = useState<PromptPreset[]>(PRESETS);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('coding-agent');
  
  // Active custom prompt values
  const [systemInstructions, setSystemInstructions] = useState<string>(PRESETS[0].systemInstructions);
  const [userPrompt, setUserPrompt] = useState<string>(PRESETS[0].userPrompt);
  const [copied, setCopied] = useState<boolean>(false);

  const selectPreset = (preset: PromptPreset) => {
    setSelectedPresetId(preset.id);
    setSystemInstructions(preset.systemInstructions);
    setUserPrompt(preset.userPrompt);
  };

  const insertXmlTag = (tag: string, target: 'system' | 'user') => {
    const openTag = `<${tag}>\n`;
    const closeTag = `\n</${tag}>`;
    
    if (target === 'system') {
      setSystemInstructions(prev => `${prev}\n${openTag}Your custom text here${closeTag}`);
    } else {
      setUserPrompt(prev => `${prev}\n${openTag}Your custom context/variables here${closeTag}`);
    }
  };

  const getFullCompiledPrompt = () => {
    return `=== SYSTEM INSTRUCTIONS ===\n${systemInstructions}\n\n=== USER PROMPT ===\n${userPrompt}`;
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(getFullCompiledPrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="prompt-workbench-view" className="space-y-8 animate-fade-in">
      {/* Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-orange-500" />
            Interactive Prompt Engineering Workbench
          </h2>
          <p className="text-zinc-400 text-sm">
            Master Claude's secret superpowers: XML structured prompting, pre-filling answers, and <code className="text-zinc-300 font-mono">&lt;thinking&gt;</code> separation.
          </p>
        </div>
        <button
          onClick={copyPrompt}
          className="px-3.5 py-2 bg-orange-500 hover:bg-orange-400 text-zinc-950 font-semibold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Full Prompt Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Formatted Prompt</span>
            </>
          )}
        </button>
      </div>

      {/* Preset pickers */}
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider block">Choose a Prompting Architecture Template</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {presets.map((preset) => {
            const isSelected = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                onClick={() => selectPreset(preset)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900 border-orange-500/50 shadow-lg'
                    : 'bg-zinc-900/20 border-zinc-800 hover:bg-zinc-900/40 hover:border-zinc-700'
                }`}
              >
                <span className="text-[10px] font-mono font-bold bg-zinc-950 px-2 py-0.5 rounded text-orange-400 border border-orange-500/10">
                  {preset.category}
                </span>
                <h4 className="font-semibold text-white text-sm mt-2">{preset.name}</h4>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column: Builders */}
        <div className="space-y-6">
          {/* Section A: System Instructions */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Code className="w-4.5 h-4.5 text-orange-500" />
                System Prompt / Instructions
              </h3>
              {/* Quick inserts */}
              <div className="flex gap-1.5">
                <button
                  onClick={() => insertXmlTag('system_instructions', 'system')}
                  className="bg-zinc-950 hover:bg-zinc-900 text-[10px] font-mono px-2 py-1 rounded text-zinc-400 border border-zinc-800 hover:text-orange-400 cursor-pointer"
                  title="Insert System Instructions tag block"
                >
                  + &lt;system_instructions&gt;
                </button>
              </div>
            </div>

            <textarea
              value={systemInstructions}
              onChange={(e) => setSystemInstructions(e.target.value)}
              className="w-full h-36 bg-zinc-950 border border-zinc-800 rounded-lg p-3 font-mono text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-orange-500 leading-relaxed"
              placeholder="Configure system behavior here..."
            />
          </div>

          {/* Section B: User Prompt */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <FileText className="w-4.5 h-4.5 text-orange-500" />
                User Prompt / Context & Variables
              </h3>
              
              {/* XML insert tags */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => insertXmlTag('context', 'user')}
                  className="bg-zinc-950 hover:bg-zinc-900 text-[10px] font-mono px-2 py-1 rounded text-zinc-400 border border-zinc-800 hover:text-orange-400 cursor-pointer"
                >
                  + &lt;context&gt;
                </button>
                <button
                  onClick={() => insertXmlTag('task', 'user')}
                  className="bg-zinc-950 hover:bg-zinc-900 text-[10px] font-mono px-2 py-1 rounded text-zinc-400 border border-zinc-800 hover:text-orange-400 cursor-pointer"
                >
                  + &lt;task&gt;
                </button>
                <button
                  onClick={() => insertXmlTag('thinking', 'user')}
                  className="bg-zinc-950 hover:bg-zinc-900 text-[10px] font-mono px-2 py-1 rounded text-zinc-400 border border-zinc-800 hover:text-orange-400 cursor-pointer"
                  title="Separates reasoning before action"
                >
                  + &lt;thinking&gt;
                </button>
              </div>
            </div>

            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full h-48 bg-zinc-950 border border-zinc-800 rounded-lg p-3 font-mono text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-orange-500 leading-relaxed"
              placeholder="Build user prompt context or XML schemas here..."
            />
          </div>
        </div>

        {/* Right column: Full Preview & Best Practices */}
        <div className="space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4.5 h-4.5 text-orange-500" />
              Live Prompt Structure Preview
            </h3>

            <div className="bg-zinc-950 rounded-lg p-4 font-mono text-[11px] text-zinc-400 leading-relaxed space-y-3 border border-zinc-900 overflow-y-auto max-h-[380px]">
              <div>
                <span className="text-orange-500 font-bold block mb-1">⚡️ System prompt setup:</span>
                <pre className="text-zinc-300 whitespace-pre-wrap select-all bg-zinc-900/50 p-2.5 rounded border border-zinc-900">
                  {systemInstructions || '(Empty System Prompt)'}
                </pre>
              </div>
              
              <div className="border-t border-zinc-900/60 pt-3">
                <span className="text-orange-500 font-bold block mb-1">✉️ User message payload:</span>
                <pre className="text-zinc-300 whitespace-pre-wrap select-all bg-zinc-900/50 p-2.5 rounded border border-zinc-900">
                  {userPrompt || '(Empty User Prompt)'}
                </pre>
              </div>
            </div>
          </div>

          {/* Quick tips card */}
          <div className="bg-gradient-to-r from-orange-500/5 to-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-500" />
              Claude Prompt Engineering Rules of Thumb
            </h4>
            <ul className="text-xs text-zinc-400 space-y-2 list-disc pl-4 leading-relaxed">
              <li>
                <strong className="text-zinc-300">XML Tag Separation:</strong> Claude excels when context, guidelines, task orders, and database models are cleanly wrapped in nested XML tags (e.g. <code className="text-zinc-300 font-mono">&lt;source&gt;...&lt;/source&gt;</code>).
              </li>
              <li>
                <strong className="text-zinc-300">Prompt Pre-filling:</strong> Steer Claude's layout structure or response format by adding custom initial tokens inside the assistant message payload (like <code className="text-zinc-300 font-mono">&lt;json&gt;</code>).
              </li>
              <li>
                <strong className="text-zinc-300">Let Claude Think:</strong> Always suggest starting responses with a <code className="text-zinc-300 font-mono">&lt;thinking&gt;</code> tag to encourage Claude to do deep multi-turn planning before editing code or responding.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
