import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Terminal, 
  Trash2, 
  Sparkles, 
  Bot, 
  User, 
  HelpCircle, 
  AlertCircle, 
  Check, 
  Copy,
  ArrowRight
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_PROMPTS = [
  {
    label: "Stream with Claude SDK",
    prompt: "Show me a TypeScript code example to stream responses from Claude 3.5 Sonnet using the official @anthropic-ai/sdk."
  },
  {
    label: "MCP server template",
    prompt: "Write a complete boilerplate for a custom Node.js MCP (Model Context Protocol) server that has a 'search_users' tool."
  },
  {
    label: "Migrate from OpenAI",
    prompt: "Show me how to translate an OpenAI chat completion API call to the Anthropic Claude API SDK format side-by-side."
  },
  {
    label: "Structured XML Prompt",
    prompt: "Can you design a structured prompt template for Claude using XML tags that lets Claude plan inside a <thinking> block before answering?"
  }
];

export default function DevAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('claude_dev_chat');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse chat logs', e);
      }
    } else {
      // Set a friendly initial greeting
      setMessages([
        {
          role: 'assistant',
          content: "Hello! I am your interactive **Claude Developer Assistant**, backed by Gemini AI logic.\n\nI am an expert in Anthropic's ecosystem: **Claude 3/3.5 Models**, prompt optimization, **XML-based templates**, and the **Model Context Protocol (MCP)**.\n\nAsk me how to write SDK clients, build custom MCP tools, stream tokens, or design prompt templates!"
        }
      ]);
    }
  }, []);

  // Save chat to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('claude_dev_chat', JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: textToSend };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server returned an error');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to generate response. Please verify your GEMINI_API_KEY is configured correctly.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    const defaultGreeting: ChatMessage[] = [
      {
        role: 'assistant',
        content: "Hello! I am your interactive **Claude Developer Assistant**, backed by Gemini AI logic.\n\nI am an expert in Anthropic's ecosystem: **Claude 3/3.5 Models**, prompt optimization, **XML-based templates**, and the **Model Context Protocol (MCP)**.\n\nAsk me how to write SDK clients, build custom MCP tools, stream tokens, or design prompt templates!"
      }
    ];
    setMessages(defaultGreeting);
    localStorage.removeItem('claude_dev_chat');
    setError(null);
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div id="ai-chat-view" className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-14rem)] min-h-[500px]">
      {/* Left Sidebar: Prompts & Quick-actions */}
      <div className="lg:col-span-1 space-y-6 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-500" />
              Quick Quickstarts
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Click any blueprint suggestion below to automatically query the developer assistant.
            </p>
          </div>

          <div className="space-y-2">
            {QUICK_PROMPTS.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp.prompt)}
                disabled={isLoading}
                className="w-full text-left p-3 bg-zinc-900/30 hover:bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-zinc-300 hover:text-orange-400 hover:border-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <div className="font-bold flex items-center justify-between gap-1">
                  <span>{qp.label}</span>
                  <ArrowRight className="w-3 h-3 text-zinc-600" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info card */}
        <div className="bg-zinc-900/30 border border-zinc-850 rounded-xl p-4 text-[11px] text-zinc-500 space-y-2 leading-relaxed">
          <div className="flex items-center gap-1.5 text-zinc-400 font-bold font-mono">
            <Terminal className="w-3.5 h-3.5 text-orange-500" />
            CONTEXT SCOPE ACTIVE
          </div>
          <p>
            The chatbot is powered by Gemini, running server-side with customized System Guidelines loaded with the latest Claude API specs, prices, constraints, and MCP protocols.
          </p>
        </div>
      </div>

      {/* Main Chat Panel */}
      <div className="lg:col-span-3 bg-zinc-900/50 border border-zinc-800 rounded-xl flex flex-col h-full overflow-hidden">
        {/* Header bar */}
        <div className="bg-zinc-950/80 border-b border-zinc-800/80 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-sm text-zinc-200">ClaudeDevAssistant Session</span>
          </div>

          <button
            onClick={clearChat}
            className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-red-400 border border-zinc-800 hover:border-red-500/10 rounded-md transition-colors cursor-pointer"
            title="Clear Chat Logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Message Logs */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, idx) => {
            const isAi = msg.role === 'assistant';
            return (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-4xl ${isAi ? '' : 'flex-row-reverse ml-auto'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                  isAi 
                    ? 'bg-zinc-900 border-orange-500/30 text-orange-400' 
                    : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                }`}>
                  {isAi ? <Bot className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
                </div>

                {/* Bubble content */}
                <div className="space-y-1.5 max-w-[85%]">
                  <div className={`rounded-xl p-4 text-xs leading-relaxed font-sans ${
                    isAi 
                      ? 'bg-zinc-900 text-zinc-300 border border-zinc-800/80' 
                      : 'bg-orange-500 text-zinc-950 font-medium shadow-md shadow-orange-500/5'
                  }`}>
                    {/* Render message with robust simple markdown parsing */}
                    <div className="space-y-2 whitespace-pre-wrap">
                      {msg.content.split('\n\n').map((para, pIdx) => {
                        // Check if it's a code block
                        if (para.startsWith('```')) {
                          const lines = para.split('\n');
                          const lang = lines[0].replace('```', '') || 'code';
                          const code = lines.slice(1, lines.length - (lines[lines.length - 1] === '```' ? 1 : 0)).join('\n');
                          return (
                            <div key={pIdx} className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 font-mono text-[11px] text-zinc-300 space-y-1.5 mt-2 relative select-all">
                              <div className="flex justify-between items-center text-[9px] text-zinc-600 font-bold uppercase tracking-wider pb-1.5 border-b border-zinc-900 select-none">
                                <span>{lang}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(code, idx);
                                  }}
                                  className="hover:text-zinc-400"
                                >
                                  {copiedIndex === idx ? 'Copied!' : 'Copy'}
                                </button>
                              </div>
                              <pre className="overflow-x-auto select-all">{code}</pre>
                            </div>
                          );
                        }

                        // Bold phrases
                        let formattedText = para;
                        const boldRegex = /\*\*(.*?)\*\*/g;
                        const inlineCodeRegex = /`(.*?)`/g;

                        return (
                          <p 
                            key={pIdx}
                            dangerouslySetInnerHTML={{
                              __html: formattedText
                                .replace(boldRegex, '<strong class="text-white font-bold">$1</strong>')
                                .replace(inlineCodeRegex, '<code class="bg-zinc-950 text-orange-400 px-1 py-0.5 rounded font-mono text-[11px]">$1</code>')
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0">
                <Bot className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div className="bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-zinc-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce delay-200" />
                <span className="italic">ClaudeDevAssistant is formulating code...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-start gap-2 max-w-2xl">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <div className="space-y-1">
                <strong className="font-bold">Assistant Error:</strong>
                <p>{error}</p>
                <div className="text-[11px] text-zinc-500 mt-2">
                  Please ensure you have configured <code className="text-zinc-400 font-mono">GEMINI_API_KEY</code> inside the Secrets / Environment variable settings panel in Google AI Studio.
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Footer */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="p-4 bg-zinc-950/80 border-t border-zinc-800/80 flex items-center gap-3"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            placeholder="Type your coding question (e.g. 'How do I pass XML system prompts?')"
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-orange-500 hover:bg-orange-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 font-bold p-2.5 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
