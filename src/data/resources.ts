import { Resource, McpServer } from '../types';

export const RESOURCES: Resource[] = [
  // Official
  {
    id: 'anthropic-console',
    title: 'Anthropic Console',
    description: 'The primary portal to manage your API keys, test prompts in the Workbench, and track usage statistics.',
    url: 'https://console.anthropic.com/',
    category: 'Official',
    tags: ['Dashboard', 'API Keys', 'Workbench'],
    isOfficial: true,
    iconName: 'Terminal'
  },
  {
    id: 'anthropic-api-docs',
    title: 'API Documentation',
    description: 'Comprehensive developer guides, interactive API reference documentation, and step-by-step integration tutorials.',
    url: 'https://docs.anthropic.com/',
    category: 'Official',
    tags: ['Docs', 'Guides', 'Reference'],
    isOfficial: true,
    iconName: 'BookOpen'
  },
  {
    id: 'anthropic-cookbook',
    title: 'Anthropic Cookbook',
    description: 'A rich repository of Jupyter notebooks containing production recipes, pattern guides, and ready-to-run examples.',
    url: 'https://github.com/anthropics/anthropic-cookbook',
    category: 'Official',
    tags: ['Recipes', 'Code', 'Notebooks'],
    isOfficial: true,
    iconName: 'Compass'
  },
  {
    id: 'claude-prompt-library',
    title: 'Claude Prompt Library',
    description: 'A curated collection of dozens of highly optimized system and user prompts for coding, analysis, and creative work.',
    url: 'https://docs.anthropic.com/en/prompt-library/library',
    category: 'Official',
    tags: ['Prompts', 'Examples', 'Templates'],
    isOfficial: true,
    iconName: 'FileText'
  },
  {
    id: 'mcp-official-docs',
    title: 'Model Context Protocol (MCP) Docs',
    description: 'Official standard spec and guides for MCP—an open protocol connecting AI assistants to data sources and tools.',
    url: 'https://modelcontextprotocol.org/',
    category: 'Official',
    tags: ['MCP', 'Standard', 'Integration'],
    isOfficial: true,
    iconName: 'Cpu'
  },
  {
    id: 'anthropic-system-prompts',
    title: 'Official System Prompts',
    description: 'Explore the actual system prompts used by Anthropic to configure Claude 3 and Claude 3.5 production models.',
    url: 'https://docs.anthropic.com/en/release-notes/system-prompts',
    category: 'Official',
    tags: ['System Prompts', 'Alignment', 'XML'],
    isOfficial: true,
    iconName: 'ShieldAlert'
  },

  // SDKs
  {
    id: 'sdk-typescript',
    title: '@anthropic-ai/sdk (TypeScript)',
    description: 'The official TypeScript/JavaScript client library for node, browsers, and edge environments.',
    url: 'https://github.com/anthropics/anthropic-sdk-typescript',
    category: 'SDKs',
    tags: ['TypeScript', 'JavaScript', 'Node', 'SDK'],
    isOfficial: true,
    iconName: 'Code'
  },
  {
    id: 'sdk-python',
    title: 'anthropic (Python)',
    description: 'The official Python client library, supporting both synchronous and asynchronous calls with modern typing.',
    url: 'https://github.com/anthropics/anthropic-sdk-python',
    category: 'SDKs',
    tags: ['Python', 'SDK', 'Async'],
    isOfficial: true,
    iconName: 'Code'
  },
  {
    id: 'sdk-go',
    title: 'anthropic-sdk-go',
    description: 'Official Anthropic client library for the Go programming language.',
    url: 'https://github.com/anthropics/anthropic-sdk-go',
    category: 'SDKs',
    tags: ['Go', 'Golang', 'SDK'],
    isOfficial: true,
    iconName: 'Code'
  },
  {
    id: 'sdk-rust',
    title: 'anthropic-rust',
    description: 'A community-built rust client library for Anthropic\'s Claude API.',
    url: 'https://github.com/mre/anthropic-rust',
    category: 'SDKs',
    tags: ['Rust', 'Community', 'SDK'],
    isOfficial: false,
    iconName: 'Cpu'
  },

  // Prompts
  {
    id: 'anthropic-metaprompt',
    title: 'Anthropic Metaprompt Notebook',
    description: 'A powerful tool that uses Claude to generate high-quality system prompts tailored specifically to your tasks.',
    url: 'https://github.com/anthropics/anthropic-cookbook/blob/main/misc/metaprompt.ipynb',
    category: 'Prompts',
    tags: ['Metaprompt', 'Generator', 'Cookbook'],
    isOfficial: true,
    iconName: 'Lightbulb'
  },
  {
    id: 'prompt-eng-tutorial',
    title: 'Interactive Prompt Tutorial',
    description: 'Anthropic\'s interactive, self-paced prompt engineering course structured across modular lessons.',
    url: 'https://github.com/anthropics/prompt-eng-interactive-tutorial',
    category: 'Prompts',
    tags: ['Tutorial', 'Learning', 'Prompt Engineering'],
    isOfficial: true,
    iconName: 'GraduationCap'
  },
  {
    id: 'promptlayer',
    title: 'PromptLayer',
    description: 'A developer platform to track, manage, and evaluate Claude prompt templates and API request histories.',
    url: 'https://promptlayer.com/',
    category: 'Prompts',
    tags: ['Prompts', 'Tracking', 'DevTools'],
    isOfficial: false,
    iconName: 'Layers'
  },

  // MCP (Model Context Protocol)
  {
    id: 'mcp-servers-hub',
    title: 'Official MCP Servers Hub',
    description: 'A collection of standard, reference Model Context Protocol servers maintained by the community and Anthropic.',
    url: 'https://github.com/modelcontextprotocol/servers',
    category: 'MCP',
    tags: ['MCP', 'Servers', 'Registry'],
    isOfficial: true,
    iconName: 'Server'
  },

  // Tools & Coding Integrations
  {
    id: 'claude-code',
    title: 'Claude Code (Beta)',
    description: 'An agentic CLI tool from Anthropic that can write, edit, test, and run terminal commands directly in your local directory.',
    url: 'https://docs.anthropic.com/en/docs/agents-and-tools/claude-code',
    category: 'Tools',
    tags: ['CLI', 'Agent', 'Coding', 'Official'],
    isOfficial: true,
    iconName: 'Terminal'
  },
  {
    id: 'cursor-editor',
    title: 'Cursor AI Code Editor',
    description: 'An AI-first code editor fork of VS Code, fully integrated with Claude 3.5 Sonnet for fast, agentic codebase edits.',
    url: 'https://cursor.sh/',
    category: 'Tools',
    tags: ['Editor', 'VS Code', 'Autocomplete'],
    isOfficial: false,
    iconName: 'Sparkles'
  },
  {
    id: 'cline-agent',
    title: 'Cline (autonomous coding agent)',
    description: 'An open-source VS Code extension that implements an autonomous coding agent, leveraging Claude\'s computer use and shell capability.',
    url: 'https://github.com/cline/cline',
    category: 'Tools',
    tags: ['VS Code', 'Agent', 'Open Source'],
    isOfficial: false,
    iconName: 'Play'
  },
  {
    id: 'aider-cli',
    title: 'Aider CLI Pair Programmer',
    description: 'Highly acclaimed CLI pair programmer that lets you edit code in your git repository with Claude 3.5 Sonnet.',
    url: 'https://github.com/paul-gauthier/aider',
    category: 'Tools',
    tags: ['CLI', 'Git', 'Pair Programming'],
    isOfficial: false,
    iconName: 'Zap'
  },

  // Frameworks
  {
    id: 'vercel-ai-sdk',
    title: 'Vercel AI SDK',
    description: 'The popular React/Next.js/Svelte framework for streaming AI responses, building chats, and handling tool use with Claude.',
    url: 'https://sdk.vercel.ai/docs',
    category: 'Frameworks',
    tags: ['Next.js', 'React', 'Streaming', 'UI'],
    isOfficial: false,
    iconName: 'Blocks'
  },
  {
    id: 'langchain-anthropic',
    title: 'LangChain (Anthropic Integration)',
    description: 'The standard framework for building chains, agents, and complex cognitive logic with Claude integrations.',
    url: 'https://github.com/langchain-ai/langchain',
    category: 'Frameworks',
    tags: ['Agent', 'Chains', 'Framework'],
    isOfficial: false,
    iconName: 'Link'
  }
];

export const MCP_SERVERS: McpServer[] = [
  {
    id: 'mcp-server-git',
    name: 'Git & GitHub Server',
    description: 'Provides tools for reading and writing to local Git repos, staging files, creating commits, and managing GitHub PRs/issues.',
    githubUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/git',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-github'],
    envVars: [
      {
        name: 'GITHUB_PERSONAL_ACCESS_TOKEN',
        description: 'GitHub Personal Access Token (classic or fine-grained) with repo scope.',
        required: true
      }
    ]
  },
  {
    id: 'mcp-server-postgres',
    name: 'PostgreSQL Database Server',
    description: 'Allows Claude to connect securely to a PostgreSQL database, inspect tables, examine schemas, and execute read-only queries.',
    githubUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/postgres',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-postgres'],
    envVars: [
      {
        name: 'POSTGRES_URL',
        description: 'PostgreSQL connection string (e.g., postgresql://user:password@localhost:5432/dbname)',
        required: true
      }
    ]
  },
  {
    id: 'mcp-server-sqlite',
    name: 'SQLite Database Server',
    description: 'Provides secure read and write access to a local SQLite database file, enabling structured data analysis.',
    githubUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-sqlite'],
    envVars: [
      {
        name: 'SQLITE_DB_PATH',
        description: 'Absolute path to the SQLite file on your machine.',
        required: true,
        defaultValue: '/path/to/database.db'
      }
    ]
  },
  {
    id: 'mcp-server-filesystem',
    name: 'Local Filesystem Server',
    description: 'Configures secure access to a specified set of local directories for reading files, listing folders, and searching text.',
    githubUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', '/allowed/directory'],
    envVars: []
  },
  {
    id: 'mcp-server-brave-search',
    name: 'Brave Search Server',
    description: 'Equips Claude with secure web search capabilities to lookup current, real-time facts and articles on the internet.',
    githubUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-brave-search'],
    envVars: [
      {
        name: 'BRAVE_API_KEY',
        description: 'Your API Key obtained from the Brave Search Developer portal.',
        required: true
      }
    ]
  },
  {
    id: 'mcp-server-fetch',
    name: 'Web Page Fetch & Markdown Server',
    description: 'Allows Claude to securely fetch web page HTML and cleanly convert it into high-fidelity markdown, bypassing heavy browser setups.',
    githubUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/fetch',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-fetch'],
    envVars: []
  }
];
