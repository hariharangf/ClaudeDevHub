export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'Official' | 'SDKs' | 'Prompts' | 'MCP' | 'Tools' | 'Frameworks';
  tags: string[];
  isOfficial: boolean;
  iconName: string;
}

export interface ClaudeModel {
  id: string;
  name: string;
  displayName: string;
  releaseDate: string;
  contextWindow: number; // in tokens
  maxOutput: number; // in tokens
  pricingInput: number; // per million tokens ($)
  pricingOutput: number; // per million tokens ($)
  description: string;
  strengths: string[];
  speedScore: number; // 1-10
  qualityScore: number; // 1-10
}

export interface McpServer {
  id: string;
  name: string;
  description: string;
  githubUrl: string;
  envVars: Array<{
    name: string;
    description: string;
    required: boolean;
    defaultValue?: string;
  }>;
  args?: string[];
  command: string;
}
