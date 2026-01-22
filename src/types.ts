// src/types.ts
export interface HistoryItem {
  version: string;
  updatedAt: string;
  author: string;
  changeLog: string;
  policyData: Record<string, string>;
  edgeCases: string[];
  // [추가] 체크리스트 항목 정의가 있어야 에러가 사라집니다.
  checklist: {
    task: string;
    status: string;
  }[];
}

export interface FeaturePolicy {
  id: string;
  featureName: string;
  // [추가] 리스트 페이지에서 참조하는 필드를 추가합니다.
  currentVersionId: string; 
  history: HistoryItem[];
}