import { ClaudeModel } from '../types';

export const CLAUDE_MODELS: ClaudeModel[] = [
  {
    id: 'claude-3-5-sonnet',
    name: 'claude-3-5-sonnet-latest',
    displayName: 'Claude 3.5 Sonnet',
    releaseDate: 'June 2024 (Updated Oct 2024)',
    contextWindow: 200000,
    maxOutput: 8192,
    pricingInput: 3.00,
    pricingOutput: 15.00,
    description: 'Anthropic\'s most advanced model. Excels at complex coding tasks, multi-step agent actions, vision tasks, and sophisticated logic. Includes state-of-the-art Computer Use.',
    strengths: [
      'Advanced software engineering & debugging',
      'High-accuracy visual layout and graph analysis',
      'Multi-step autonomous agent coordination',
      'Computer Use capabilities (Beta)'
    ],
    speedScore: 8,
    qualityScore: 10
  },
  {
    id: 'claude-3-5-haiku',
    name: 'claude-3-5-haiku-latest',
    displayName: 'Claude 3.5 Haiku',
    releaseDate: 'November 2024',
    contextWindow: 200000,
    maxOutput: 8192,
    pricingInput: 0.80,
    pricingOutput: 4.00,
    description: 'Anthropic\'s fastest, most cost-effective model. Offers highly competitive reasoning capability at lightning-fast speeds. Ideal for real-time applications and massive data parsing.',
    strengths: [
      'Extremely low-latency interactions',
      'High-throughput data transformations',
      'Affordable multi-turn conversation agents',
      'Clean structured JSON extraction'
    ],
    speedScore: 10,
    qualityScore: 7
  },
  {
    id: 'claude-3-opus',
    name: 'claude-3-opus-latest',
    displayName: 'Claude 3 Opus',
    releaseDate: 'March 2024',
    contextWindow: 200000,
    maxOutput: 4096,
    pricingInput: 15.00,
    pricingOutput: 75.00,
    description: 'Anthropic\'s premier model for deep research, specialized science, and strategic business planning. Known for deep nuance, empathy, and mathematical analysis.',
    strengths: [
      'Nuanced literature synthesis & translation',
      'Highly empathetic conversational responses',
      'Complex mathematical and scientific proofs',
      'Multi-source document fusion'
    ],
    speedScore: 4,
    qualityScore: 9
  },
  {
    id: 'claude-3-sonnet',
    name: 'claude-3-sonnet-20240229',
    displayName: 'Claude 3 Sonnet (Legacy)',
    releaseDate: 'February 2024',
    contextWindow: 200000,
    maxOutput: 4096,
    pricingInput: 3.00,
    pricingOutput: 15.00,
    description: 'The standard balanced option of the Claude 3 family, succeeded by Claude 3.5 Sonnet.',
    strengths: [
      'General text processing & categorization',
      'Legacy integrations support'
    ],
    speedScore: 6,
    qualityScore: 6
  },
  {
    id: 'claude-3-haiku',
    name: 'claude-3-haiku-20240307',
    displayName: 'Claude 3 Haiku (Legacy)',
    releaseDate: 'March 2024',
    contextWindow: 200000,
    maxOutput: 4096,
    pricingInput: 0.25,
    pricingOutput: 1.25,
    description: 'The ultra-budget entry of the Claude 3 generation, succeeded by Claude 3.5 Haiku.',
    strengths: [
      'Budget-conscious large-scale log analysis',
      'Basic quick-response workflows'
    ],
    speedScore: 9,
    qualityScore: 5
  }
];
