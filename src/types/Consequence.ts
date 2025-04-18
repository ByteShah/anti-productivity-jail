export enum ConsequenceType {
  SOCIAL = 'social',
  FINANCIAL = 'financial',
  TECH = 'tech',
  AI = 'ai',
}

export interface ConsequenceConfig {
  [key: string]: any;
}

export interface Consequence {
  id: string;
  type: ConsequenceType;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  enabled: boolean;
  config: ConsequenceConfig;
  executedAt?: string; // ISO date string for when it was last executed
}