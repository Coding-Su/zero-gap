// src/types.ts
export interface VersionSnapshot {
  version: string;
  updatedAt: string;
  author: string;
  changeLog: string;
  problemCount?: number;
  audioPitch?: string;
  edgeCases: string[];
  tasks: { id: number; text: string; done: boolean }[];
}

export interface FeaturePolicy {
  id: string;
  featureName: string;
  currentVersionId: string;
  history: VersionSnapshot[];
}