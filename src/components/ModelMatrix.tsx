import React, { useState } from 'react';
import { CLAUDE_MODELS } from '../data/models';
import { ClaudeModel } from '../types';
import { 
  Calculator, 
  HelpCircle, 
  TrendingUp, 
  Cpu, 
  Coins, 
  Zap, 
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';

export default function ModelMatrix() {
  const [models] = useState<ClaudeModel[]>(CLAUDE_MODELS);
  const [selectedModelId, setSelectedModelId] = useState<string>('claude-3-5-sonnet');
  
  // Pricing simulator state
  const [dailyRequests, setDailyRequests] = useState<number>(1000);
  const [promptTokens, setPromptTokens] = useState<number>(1500);
  const [completionTokens, setCompletionTokens] = useState<number>(500);

  const activeModel = models.find(m => m.id === selectedModelId) || models[0];

  // Calculations
  const calculateCost = (model: ClaudeModel) => {
    const promptCost = (promptTokens / 1_000_000) * model.pricingInput;
    const completionCost = (completionTokens / 1_000_000) * model.pricingOutput;
    const singleCost = promptCost + completionCost;
    const dailyCost = singleCost * dailyRequests;
    const monthlyCost = dailyCost * 30;

    return {
      single: singleCost.toFixed(4),
      daily: dailyCost.toFixed(2),
      monthly: monthlyCost.toFixed(2),
    };
  };

  return (
    <div id="model-comparison-view" className="space-y-8 animate-fade-in">
      {/* Introduction */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-orange-500" />
            Claude Model Intelligence Matrix
          </h2>
          <p className="text-zinc-400 text-sm">
            Compare context sizes, token caps, developer pricing, and run live cost simulations for the Claude 3 and 3.5 model families.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <span className="text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-full font-mono">
            Active: {models.length} Models
          </span>
          <span className="text-xs bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full font-mono">
            Latest SDKs Connected
          </span>
        </div>
      </div>

      {/* Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {models.map((model) => {
          const isSelected = model.id === selectedModelId;
          return (
            <button
              key={model.id}
              onClick={() => setSelectedModelId(model.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-zinc-900 border-orange-500/60 shadow-lg shadow-orange-500/5'
                  : 'bg-zinc-900/30 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className={`text-xs font-mono font-medium ${isSelected ? 'text-orange-400' : 'text-zinc-500'}`}>
                  {model.id.includes('3-5') ? 'v3.5 Generation' : 'v3 Generation'}
                </span>
                {model.id === 'claude-3-5-sonnet' && (
                  <span className="bg-orange-500 text-white text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                    Best
                  </span>
                )}
              </div>
              <h4 className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                {model.displayName}
              </h4>
              <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{model.name}</p>
            </button>
          );
        })}
      </div>

      {/* Model Spec Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deep Dive card */}
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-6">
          <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">{activeModel.displayName} Specification</h3>
              <p className="text-zinc-400 text-xs font-mono mt-0.5">ID: {activeModel.name}</p>
            </div>
            <div className="text-right">
              <span className="text-zinc-500 text-xs block">Released</span>
              <span className="text-zinc-300 text-xs font-medium font-mono">{activeModel.releaseDate}</span>
            </div>
          </div>

          <p className="text-zinc-300 text-sm leading-relaxed">
            {activeModel.description}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-zinc-950 p-4 rounded-lg border border-zinc-900">
            <div className="space-y-1">
              <span className="text-zinc-500 text-[11px] uppercase font-mono tracking-wider">Context Window</span>
              <div className="text-white font-semibold font-mono text-sm">
                {(activeModel.contextWindow / 1000).toLocaleString()}K
                <span className="text-[10px] text-zinc-500 font-normal ml-1">tokens</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-500 text-[11px] uppercase font-mono tracking-wider">Max Output limit</span>
              <div className="text-white font-semibold font-mono text-sm">
                {(activeModel.maxOutput / 1000).toLocaleString()}K
                <span className="text-[10px] text-zinc-500 font-normal ml-1">tokens</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-500 text-[11px] uppercase font-mono tracking-wider">Cost Input</span>
              <div className="text-emerald-400 font-semibold font-mono text-sm">
                ${activeModel.pricingInput.toFixed(2)}
                <span className="text-[10px] text-zinc-500 font-normal ml-0.5">/M tokens</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-500 text-[11px] uppercase font-mono tracking-wider">Cost Output</span>
              <div className="text-emerald-400 font-semibold font-mono text-sm">
                ${activeModel.pricingOutput.toFixed(2)}
                <span className="text-[10px] text-zinc-500 font-normal ml-0.5">/M tokens</span>
              </div>
            </div>
          </div>

          {/* Core Strengths */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              Target Suitabilities & Strengths
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {activeModel.strengths.map((strength, idx) => (
                <div key={idx} className="flex items-start gap-2 text-zinc-300 text-sm">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{strength}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scores Slider / Visuals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-800/60">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400 font-medium">Quality & Logic Score</span>
                <span className="text-orange-400 font-mono font-bold">{activeModel.qualityScore} / 10</span>
              </div>
              <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                <div 
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${activeModel.qualityScore * 10}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400 font-medium">Generation Speed & Latency</span>
                <span className="text-orange-400 font-mono font-bold">{activeModel.speedScore} / 10</span>
              </div>
              <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                <div 
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${activeModel.speedScore * 10}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cost & Token Estimator Calculator */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-orange-500" />
              API Cost & Token Estimator
            </h3>
            <p className="text-zinc-400 text-xs">
              Simulate high-throughput API volumes to estimate your monthly Anthropic billing budgets.
            </p>
          </div>

          {/* Input elements */}
          <div className="space-y-4 my-4">
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-mono flex justify-between">
                <span>Daily Requests</span>
                <span className="text-zinc-300 font-bold">{dailyRequests.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="10"
                max="50000"
                step="50"
                value={dailyRequests}
                onChange={(e) => setDailyRequests(parseInt(e.target.value))}
                className="w-full accent-orange-500 bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-mono flex justify-between">
                <span>Prompt / Input Tokens</span>
                <span className="text-zinc-300 font-bold">{promptTokens.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="100"
                max="50000"
                step="100"
                value={promptTokens}
                onChange={(e) => setPromptTokens(parseInt(e.target.value))}
                className="w-full accent-orange-500 bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-mono flex justify-between">
                <span>Completion / Output Tokens</span>
                <span className="text-zinc-300 font-bold">{completionTokens.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="50"
                max="8192"
                step="50"
                value={completionTokens}
                onChange={(e) => setCompletionTokens(parseInt(e.target.value))}
                className="w-full accent-orange-500 bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Results Block */}
          <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-900 space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Selected Model Cost Profile:</span>
              <span className="text-zinc-300 font-semibold">{activeModel.displayName}</span>
            </div>
            
            <div className="border-t border-zinc-900/60 pt-2 flex items-baseline justify-between">
              <span className="text-xs text-zinc-400 font-medium">Cost Per Request</span>
              <span className="text-emerald-400 font-mono font-bold text-sm">
                ${calculateCost(activeModel).single}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-xs text-zinc-400 font-medium">Daily Budget</span>
              <span className="text-emerald-400 font-mono font-bold text-sm">
                ${calculateCost(activeModel).daily}
              </span>
            </div>

            <div className="border-t border-zinc-900/60 pt-2 flex items-baseline justify-between">
              <span className="text-xs text-zinc-100 font-bold">Estimated Monthly Bill</span>
              <span className="text-emerald-400 font-mono font-bold text-xl">
                ${calculateCost(activeModel).monthly}
              </span>
            </div>
          </div>

          <div className="text-[10px] text-zinc-500 mt-2 flex items-center gap-1 leading-normal">
            <Info className="w-3 h-3 text-orange-500 shrink-0" />
            <span>Pricing matches Anthropic API rate definitions. Input values do not include prompt cache discounts.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
